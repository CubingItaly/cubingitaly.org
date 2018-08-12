import { Router, Request, Response } from "express";
import { verifyLogin, getUser } from '../../shared/login.utils';
import { Deserialize, Serialize } from "cerialize";
import { ArticleEntity } from "../../db/entity/article.entity";
import { ArticleRepository } from "../../db/repositories/article.repository";
import { getCustomRepository } from "typeorm";
import { query, validationResult, Result } from "express-validator/check";
import { return400, return404, return403 } from "../../shared/error.utils";
import { UserEntity } from "../../db/entity/user.entity";
import { ArticleModel } from "../../models/classes/article.model";


const router: Router = Router();

/**
 * Instantiates a UserRepository and returns it
 *
 * @returns {UserRepository}
 */
function getArticlerRepository(): ArticleRepository {
    const repository: ArticleRepository = getCustomRepository(ArticleRepository);
    return repository;
}

router.get("/", [query('page').isNumeric().optional({ checkFalsy: true }), query('limit').isNumeric().optional({ checkFalsy: true })]
    , async (req: Request, res: Response) => {
        let error: Result = validationResult(req);
        if (!error.isEmpty()) {
            return return400(res);
        }
        let limit: number = req.query.limit || 12;
        let page: number = req.query.page || 0;
        let dbArticle: ArticleEntity[] = await getArticlerRepository().getPublicArticles(limit, page);
        return res.status(200).json(dbArticle);
    });

async function checkIfArticleExist(req, res, next) {
    const articleRepo: ArticleRepository = getArticlerRepository();
    let exist: boolean = await articleRepo.checkIfArticleExists(req.params.id);
    if (exist) {
        next();
    } else {
        return return404(res);
    }
}

function canAccessArticle(req, article: ArticleEntity): boolean {
    if (article.isPublic) {
        return true;
    } else {
        return getUser(req).canEditArticles()
    }
}

function canEditArticle(req, res, next) {
    if (getUser(req).canEditArticles()) {
        next();
    } else {
        return return403(res);
    }
}

function canAdminArticle(req, res, next) {
    if (getUser(req).canAdminArticles()) {
        next();
    } else {
        return return403(res);
    }
}

function articleIsInTheBody(req, res, next) {
    let article: ArticleModel = Deserialize(req.body.article, ArticleModel) || null;
    if (article !== undefined && article !== null && article.title !== null && article.title !== undefined) {
        next();
    } else {
        return return400(res);
    }
}

function sanitizeContent(req, res, next) {
    req.body.article.title = req.sanitize(req.body.article.title);
    req.body.article.content = req.sanitize(req.body.article.content);
    req.body.article.summary = req.sanitize(req.body.article.summary);
    next();
}

router.get("/porcoddio", async (req, res) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    let dbArticle = await articleRepo.createArticle("hackerino");
    res.json(dbArticle);
})

router.post("/", verifyLogin, canAdminArticle, checkIfArticleExist, articleIsInTheBody, sanitizeContent, async (req, res: Response) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    const modelArticle: ArticleModel = Deserialize(req.body.article, ArticleModel);
    let dbArticle: ArticleEntity = new ArticleEntity();
    dbArticle._assimilate(modelArticle);
    let newArticle: ArticleEntity = await articleRepo.createArticle(dbArticle.title);

    dbArticle.id = newArticle.title;

    let user: UserEntity = new UserEntity();
    user._assimilate(getUser(req));
    dbArticle = await articleRepo.adminUpdateArticle(dbArticle, user);
    res.status(200).json(dbArticle._transform());
});

router.get("/:id", checkIfArticleExist, async (req: Request, res: Response) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    let dbArticle: ArticleEntity = await articleRepo.getArticleById(req.params.id);
    if (canAccessArticle(req, dbArticle)) {
        return res.status(200).json(dbArticle._transform());
    } else {
        return404(res);
    }
});

router.put("/:id", verifyLogin, canEditArticle, checkIfArticleExist, articleIsInTheBody, sanitizeContent, async (req: Request, res: Response) => {
    updateArticle(req, res, false);
});

router.delete("/:id/admin", verifyLogin, canAdminArticle, checkIfArticleExist, async (req: Request, res: Response) => {
    const articleRepo: ArticleRepository = getArticlerRepository();
    await articleRepo.deleteArticle(req.params.id);
    res.status(200);
});

router.put("/:id/admin", verifyLogin, canAdminArticle, checkIfArticleExist, articleIsInTheBody, sanitizeContent, async (req: Request, res: Response) => {
    updateArticle(req, res, true);
});

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


router.get("/count/public", async (req: Request, res: Response) => {
    res.status(200).json({ number: await getArticlerRepository().countPublicArticles() });
});

router.get("/count/all", verifyLogin, canAdminArticle, async (req: Request, res: Response) => {
    res.status(200).json({ number: await getArticlerRepository().countAllArticles() });
});


export { router }