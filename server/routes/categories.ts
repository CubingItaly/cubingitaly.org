import { Router } from "express";
import { Deserialize, Serialize } from "cerialize";
import { getCustomRepository } from "typeorm";
import { CIArticleCategoriesRepository } from "../db/repositories/db.ci.article.categories.repo";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";
import { CategoriesResponse } from "../models/responses/categories.response.model";
import { DBArticleCategory } from "../db/entity/db.article.category";

const categoriesRouter: Router = Router();

categoriesRouter.get("/", async (req, res) => {
    const categories_repo: CIArticleCategoriesRepository = getCustomRepository(CIArticleCategoriesRepository);
    const response: CategoriesResponse = new CategoriesResponse();
    try {
        let db_categories: DBArticleCategory[] = await categories_repo.findCategories();
        response.categories = db_categories.map(cat => cat._transform());
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "There was an error while processing the request";
    }

    res.send(JSON.stringify(Serialize(response)));
})

export { categoriesRouter }