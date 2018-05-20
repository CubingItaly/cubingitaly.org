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

articlesRouter.get("/", async (req, res) => {
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticlesResponse = new ArticlesResponse();
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

articlesRouter.get("/admin", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: ArticlesResponse = new ArticlesResponse();
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const page: number = req.query.page || 0;
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

articlesRouter.get("/:id", async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    let article_id = req.params.id;
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticleResponse = new ArticleResponse();
    try {
        let db_article: DBArticle = await article_repo.findArticleById(article_id);
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

articlesRouter.delete("/:id", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: GenericResponse = new GenericResponse();

    if (user.canAdminArticles()) {

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

articlesRouter.put("/:id", authCheck, async (req, res) => {
    const user: CIUser = Deserialize(req.user, CIUser);
    const response: ArticleResponse = new ArticleResponse();

    if (user.canEditArticles()) {
        let article: Article = Deserialize(req.body.article, Article);
        const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
        try {

            let db_article = new DBArticle();
            db_article._assimilate(article);

            if (user.canEditArticles()) {
                let updated_article: DBArticle = await article_repo.updateArticle(db_article);
            }
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