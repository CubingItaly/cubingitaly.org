import { Router, Request, Response } from "express";
import { verifyLogin, getUser, isLoggedIn } from '../../shared/login.utils';
import { Deserialize, Serialize } from "cerialize";
import { ArticleEntity } from "../../db/entity/article.entity";
import { ArticleRepository } from "../../db/repository/article.repository";
import { getCustomRepository } from "typeorm";
import { query, validationResult, Result } from "express-validator/check";
import { sendError } from "../../shared/error.utils";
import { UserEntity } from "../../db/entity/user.entity";
import { ArticleModel } from "../../models/classes/article.model";
import { UserRepository } from "../../db/repository/user.repository";
import { sanitize } from "./sanitizer";

const router: Router = Router();

/**
 * Instantiate a ArticleRepository and return it
 *
 * @returns {ArticleRepository}
 */
function getArticlerRepository(): ArticleRepository {
    const repository: ArticleRepository = getCustomRepository(ArticleRepository);
    return repository;
}

/**
 * Return a list of public articles.
 * Parameters page and limit are used for paging.
 * Defaults: page = 0, limit = 12.
 */
router.get("/", [query('page').isNumeric().optional({ checkFalsy: true }), query('limit').isNumeric().optional({ checkFalsy: true })]
    , async (req: Request, res: Response) => {
        let error: Result = validationResult(req);
        if (!error.isEmpty()) {
            return sendError(res, 400, "Bad request. The request is malformed.");
        }
        let limit: number = Number(req.query.limit || 12);
        let page: number = Number(req.query.page || 0);
        let dbArticle: ArticleEntity[];

        if (req.query.category !== undefined) {
            dbArticle = await getArticlerRepository().getArticlesByCategory(limit, page, req.query.category);
        } else {
            dbArticle = await getArticlerRepository().getPublicArticles(limit, page);
        }

        let model: ArticleModel[] = dbArticle.map(a => a._transform());

        return res.status(200).json(model);
    });


/**
 * Return a list of all the articles.
 * Parameters page and limit are used for paging.
 * Defaults: page = 0, limit = 12.
 */
router.get("/admin", [query('page').isNumeric().optional({ checkFalsy: true }), query('limit').isNumeric().optional({ checkFalsy: true })]
    , verifyLogin, canAdminArticle, async (req: Request, res: Response) => {
        let error: Result = validationResult(req);
        if (!error.isEmpty()) {
            return sendError(res, 400, "Bad request. The request is malformed.");
        }
        let limit: number = Number(req.query.limit || 12);
        let page: number = Number(req.query.page || 0);
        let dbArticle: ArticleEntity[];

        dbArticle = await getArticlerRepository().getAllArticles(limit, page);
        let model: ArticleModel[] = dbArticle.map(a => a._transform());

        return res.status(200).json(model);
    });


/**
 * Check if the article sent to create a new one alreadys has an id.
 * If there's an id respond with error 400.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
async function idIsInTheRequest(req, res, next) {
    let article: ArticleModel = Deserialize(req.body.article, ArticleModel);
    if (article.id !== null && article.id !== undefined) {
        return sendError(res, 400, "Bad request. The request is malformed. The article shouldn't have an ID.");
    } else {
        next();
    }
}

/**
 * Check if an article exists for the id received in the request
 * If the article doesn't exist respond with error 404
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function checkIfArticleExist(req, res, next) {
    const articleRepo: ArticleRepository = getArticlerRepository();
    let exist: boolean = await articleRepo.checkIfArticleExists(req.params.id);
    if (exist) {
        next();
    } else {
        return sendError(res, 404, "The requested article does not exist");
    }
}

/**
 * Check if the user can read the article and if so return true.
 *
 * @param {*} req
 * @param {ArticleEntity} article
 * @returns {boolean}
 */
function canAccessArticle(req, article: ArticleEntity): boolean {
    if (article.isPublic) {
        return true;
    } else if (isLoggedIn(req)) {
        //If the article is not public return true only if the user can edit it
        return getUser(req).canEditArticles();
    } else {
        return false;
    }
}

/**
 * Check whether the user can edit articles.
 * If the user doesn't have that permission, return error 403.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function canEditArticle(req, res, next) {
    if (getUser(req).canEditArticles()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}

/**
 * Check whether the user can admin articles.
 * If the user doesn't have that permission, return error 403.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function canAdminArticle(req, res, next) {
    if (getUser(req).canAdminArticles()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}

/**
 * Check whether the article was attached to the request
 * In case there is not an article, return  error 400.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function articleIsInTheBody(req, res, next) {
    let article: ArticleModel = Deserialize(req.body.article, ArticleModel) || null;
    if (article !== undefined && article !== null && article.title !== null && article.title !== undefined) {
        next();
    } else {
        return sendError(res, 400, "Bad request. The request is malformed. Article is missing");
    }
}

/**
 * Clean up the article by removing javascript code from content, title and summary
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function sanitizeContent(req, res, next) {
    let tmp: string = req.sanitize(req.body.article.title);
    req.body.article.title = tmp.substr(0, 120);
    tmp = req.sanitize(req.body.article.summary) || "";
    req.body.article.summary = tmp.substr(0, 250);
    req.body.article.content = sanitize(req.body.article.content);
    next();
}

/**
 * Receive an article as a parameter in the body and use it to create a new one
 * Return the newly created article
 */
router.post("/", verifyLogin, canAdminArticle, articleIsInTheBody, idIsInTheRequest, sanitizeContent, async (req, res: Response) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    //Obtain the article passed by the client and convert it into a database entity
    const modelArticle: ArticleModel = Deserialize(req.body.article, ArticleModel);
    let dbArticle: ArticleEntity = new ArticleEntity();
    dbArticle._assimilate(modelArticle);
    //Use the database entity to create a clean new article with only title and id
    let newArticle: ArticleEntity = await articleRepo.createArticle(dbArticle.title);
    //Copy the ID of the article into the database entity
    dbArticle.id = newArticle.id;

    //Get the user who is creating the article and create a new database entity
    let user: UserEntity = new UserEntity();
    user._assimilate(getUser(req));
    //Insert the content in the new created article
    dbArticle = await articleRepo.adminUpdateArticle(dbArticle, user);
    //Return an istance of the new article
    res.status(200).json(dbArticle._transform());
});

/**
 * Return an article
 * If the article doesn't exist return error 404
 */
router.get("/:id", checkIfArticleExist, async (req: Request, res: Response) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    let dbArticle: ArticleEntity = await articleRepo.getArticleById(req.params.id);
    if (canAccessArticle(req, dbArticle)) {
        return res.status(200).json(dbArticle._transform());
    } else {
        return sendError(res, 404, "The requested article does not exist");
    }
});

/**
 * Update article's info (title, summary, content and categories) and return an instance of the updated article
 */
router.put("/:id", verifyLogin, canEditArticle, checkIfArticleExist, articleIsInTheBody, sanitizeContent, async (req: Request, res: Response) => {
    updateArticle(req, res, false);
});

/**
 * Delete an article
 */
router.delete("/:id/admin", verifyLogin, canAdminArticle, checkIfArticleExist, async (req: Request, res: Response) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    await articleRepo.deleteArticle(req.params.id);
    res.status(200).send({});
});

/**
 * Update an article information and staus the return an instance of the updated article
 */
router.put("/:id/admin", verifyLogin, canAdminArticle, checkIfArticleExist, articleIsInTheBody, sanitizeContent, async (req: Request, res: Response) => {
    updateArticle(req, res, true);
});

/**
 * Method used to update an article
 * If admin is true, article status is updated as well.
 * 
 * @param req 
 * @param res 
 * @param admin 
 */
async function updateArticle(req, res, admin: boolean) {
    const articleRepo: ArticleRepository = getArticlerRepository();
    const user: UserEntity = new UserEntity();
    user._assimilate(getUser(req));
    const modelArticle: ArticleModel = Deserialize(req.body.article, ArticleModel);
    let dbArticle: ArticleEntity = new ArticleEntity();
    dbArticle._assimilate(modelArticle);

    dbArticle = admin ? await articleRepo.adminUpdateArticle(dbArticle, user) : await articleRepo.editorUpdateArticle(dbArticle, user);
    return res.status(200).json(dbArticle._transform());
}

/**
 * Return the total number of public articles
 */
router.get("/count/public", async (req: Request, res: Response) => {
    res.status(200).json({ number: await getArticlerRepository().countPublicArticles(req.query.category) });
});

/**
 * Return the total numer of articles in the database
 */
router.get("/count/all", verifyLogin, canAdminArticle, async (req: Request, res: Response) => {
    res.status(200).json({ number: await getArticlerRepository().countAllArticles() });
});


export { router }