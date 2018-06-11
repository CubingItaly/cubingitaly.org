import { Router } from "express";
import { Deserialize, Serialize } from "cerialize";
import { Article } from "../models/article.model";
import { CIArticlesRepository } from "../db/repositories/db.ci.article.repo";
import { getCustomRepository } from "typeorm";
import { CIArticleCategoriesRepository } from "../db/repositories/db.ci.article.categories.repo";
import { DBArticle } from "../db/entity/db.article";
import { ArticleResponse } from "../models/responses/article.response.model";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";
import { ArticlesResponse } from "../models/responses/articles.response.model";
import { GenericResponse } from "../models/responses/generic.response.model";
import { DBArticleCategory } from "../db/entity/db.article.category";
import { CategoriesResponse } from "../models/responses/categories.response.model";
import { CIUser } from "../models/ci.user.model";
import { GenericNumberResponse } from "../models/responses/generic.number.respose.model";
import { DBUser } from "../db/entity/db.user";

const articlesRouter: Router = Router();

/**
 * Checks whether the user is logged in, if not returns an error
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function authCheck(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        let response: GenericResponse = new GenericResponse();
        response.status = RESPONSE_STATUS.ERROR
        response.error = "User not logged in";
        res.json(response);
    }
}

/**
 * Returns all the articles of the given page. If no page is received, returns those of the first one
 * This is used for public articles only
 */
articlesRouter.get("/", async (req, res) => {
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticlesResponse = new ArticlesResponse();
    // if a page is received, use it. Otherwise use page 0
    const page: number = req.query.page || 0;
    try {
        let db_article: DBArticle[] = await article_repo.findPublicArticles(page);
        response.articles = db_article.map(article => article._transform());
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});

/**
 * Returns all the articles of the given page. If no page is received, returns those of the first one
 * This is used for admin purpose, so it return both public and hidden articles
 */
articlesRouter.get("/admin", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: ArticlesResponse = new ArticlesResponse();
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    // if a page is received, use it. Otherwise use page 0
    const page: number = req.query.page || 0;
    //Checks if the user can admin articles, if so proceed
    if (user.canAdminArticles()) {
        try {
            let db_articles: DBArticle[] = await article_repo.findAllArticles(page);
            response.articles = db_articles.map((article: DBArticle) => article._transform());
            response.status = RESPONSE_STATUS.OK
        } catch (e) {
            console.log(e);
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "There was an error while processing the request";
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Operation not authorized";
    }

    res.send(JSON.stringify(Serialize(response)));
});


articlesRouter.post("/", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: ArticleResponse = new ArticleResponse();

    if (user.canAdminArticles()) {

        let article: Article = Deserialize(req.body.article, Article);
        const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);

        try {

            let db_article = new DBArticle();
            db_article._assimilate(article);
            db_article = await article_repo.createArticle(db_article);
            console.log(db_article);
            response.article = db_article._transform();
            response.status = RESPONSE_STATUS.OK;

        } catch (e) {
            console.log(e);
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "There was an error while processing the request";
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Operation not authorized";
    }

    res.send(JSON.stringify(Serialize(response)));
});

/**
 * This method is used to request an article, by a given id
 */
articlesRouter.get("/:id", async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    //Get article id from request params
    let article_id = req.params.id;
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticleResponse = new ArticleResponse();
    try {
        //find article in the db
        let db_article: DBArticle = await article_repo.findArticleById(article_id);
        //if the article is public or the user has permissions to edit it, proceed
        if (db_article.isPublic || user.canEditArticles()) {
            response.article = db_article._transform();
            response.status = RESPONSE_STATUS.OK;
        } else {
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "Resource requested doesn't exist";
        }

    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});

/**
 * Delete an existing article
 */
articlesRouter.delete("/:id", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: GenericResponse = new GenericResponse();

    //checks whether the user can admin articles, in case proceed
    if (user.canAdminArticles()) {
        //Get article id from request params
        let article_id = req.params.id;
        const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);

        try {

            await article_repo.deleteArticle(article_id);
            response.status = RESPONSE_STATUS.OK;

        } catch (e) {
            console.log(e);
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "There was an error while processing the request";
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Operation not authorized";
    }

    res.send(JSON.stringify(Serialize(response)));
});

/**
 * Update an existing article and, in case it doesn't exist, create it
 * Returns the updated article
 */
articlesRouter.put("/:id", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: ArticleResponse = new ArticleResponse();

    //Checks whether the user can edit article and, if so proceed
    if (user.canEditArticles()) {
        //Get the article id from the request body
        let article: Article = Deserialize(req.body.article, Article);
        const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
        try {

            let db_article = new DBArticle();
            db_article._assimilate(article);

            //Update article content, title, summary and categories
            let updated_article: DBArticle = await article_repo.updateArticle(db_article);

            //If the article status changed and user can publish/unpublish articles, do it
            let isPublic: boolean = await article_repo.isArticlePublic(article.id);
            if (isPublic != article.isPublic && user.canAdminArticles()) {
                if (article.isPublic && !isPublic) {
                    let db_user: DBUser = new DBUser();
                    db_user._assimilate(user);
                    db_article = await article_repo.publishArticle(db_article.id, db_user);
                } else if (!article.isPublic && isPublic) {
                    db_article = await article_repo.unpublishArticle(db_article.id);
                }
            }

            response.article = db_article._transform();
            response.status = RESPONSE_STATUS.OK;

        } catch (e) {
            console.log(e);
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "There was an error while processing the request";
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Operation not authorized";
    }
    res.send(JSON.stringify(Serialize(response)));
});

/**
 * Count the number of public articles
 */
articlesRouter.get("/count/public", async (req, res) => {
    const response: GenericNumberResponse = new GenericNumberResponse();
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    try {
        response.value = await article_repo.countPublicArticles();
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});

/**
 * Count the total number of articles, public and hidden
 */
articlesRouter.get("/count/all", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: GenericNumberResponse = new GenericNumberResponse();
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    if (user.canAdminArticles()) {
        try {
            response.value = await article_repo.countAllArticles();
            response.status = RESPONSE_STATUS.OK;
        } catch (e) {
            console.log(e);
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "There was an error while processing the request";
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Operation not authorized";
    }
    res.send(JSON.stringify(Serialize(response)));
});


export { articlesRouter }