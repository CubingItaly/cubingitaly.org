import { getCustomRepository } from "typeorm";
import { sendError } from "../../shared/error.utils";
import { Router } from "express";
//# we need this because otherwise passport doesn't work
import * as passport from "passport";
import { ArticleCategoryRepository } from "../../db/repository/category.repository";
import { ArticleCategoryEntity } from "../../db/entity/category.entity";
import { ArticleCategoryModel } from "../../models/classes/category.model";

const router: Router = Router();

function getCategoryRepository(): ArticleCategoryRepository {
    return getCustomRepository(ArticleCategoryRepository);
}

/**
 * Return all the article categories
 */
router.get("/", async (req, res) => {
    let dbCategories: ArticleCategoryEntity[] = await getCategoryRepository().getCategories();
    let categories: ArticleCategoryModel[] = dbCategories.map(c => c._transform());
    res.status(200).json(categories);
});

/**
 * Return a specific article category.
 * If the category doesn't exist return error 404.
 */
router.get("/:id", async (req, res) => {
    let dbCategory: ArticleCategoryEntity = await getCategoryRepository().getCategory(req.params.id);
    if (dbCategory !== undefined && dbCategory !== null) {
        let category: ArticleCategoryModel = dbCategory._transform();
        res.status(200).json(category);
    } else {
        sendError(res, 404, "The requested resource doesn't exist");
    }

});

export { router }