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

const articlesRouter: Router = Router();

articlesRouter.get("/", async (req, res) => {
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticlesResponse = new ArticlesResponse();
    try {
        let db_article: DBArticle[] = await article_repo.findPublicArticles();
        response.articles = db_article.map(article => article._transform());
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});

articlesRouter.post("/", async (req, res) => {
    let article: Article = Deserialize(req.body.article, Article);
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticleResponse = new ArticleResponse();
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

    res.send(JSON.stringify(Serialize(response)));
});

articlesRouter.get("/:id", async (req, res) => {
    let article_id = req.params.id;
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticleResponse = new ArticleResponse();
    try {
        let db_article: DBArticle = await article_repo.findArticleById(article_id);
        response.article = db_article._transform();
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});

articlesRouter.delete("/:id", async (req, res) => {
    let article_id = req.params.id;
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: GenericResponse = new GenericResponse();
    try {
        await article_repo.deleteArticle(article_id);
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});


articlesRouter.put("/:id", async (req, res) => {
    let article: Article = Deserialize(req.body.article, Article);
    const article_repo: CIArticlesRepository = getCustomRepository(CIArticlesRepository);
    const response: ArticleResponse = new ArticleResponse();
    try {
        let db_article = new DBArticle();
        db_article._assimilate(article);
        let updated_article: DBArticle = await article_repo.updateArticle(db_article);
        if (article.isPublic) {
            db_article = await article_repo.publishArticle(db_article.id);
        } else {
            db_article = await article_repo.unpublishArticle(db_article.id);
        }

        response.article = db_article._transform();
        response.status = RESPONSE_STATUS.OK;

    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
});


export { articlesRouter }