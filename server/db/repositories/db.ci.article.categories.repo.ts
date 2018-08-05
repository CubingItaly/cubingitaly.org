import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { DBArticleCategory } from "../entity/db.article.category";
import { DBArticle } from "../entity/db.article";

/**
 * Repository used to handle article categories
 * 
 * @export
 * @class CIArticleCategoriesRepository
 * @extends {BaseCommonRepository<DBArticleCategory>}
 */
@EntityRepository(DBArticleCategory)
export class CIArticleCategoriesRepository extends BaseCommonRepository<DBArticleCategory> {
    /**
     * Sets the entity identifier.
     * Sounds useful for whatever kind of reflection.
     * 
     * @type {string}
     * @memberof CITeamsRepo
     */
    public _entityIdentifier: string = "DBArticleCategory";

    /**
     * Inits some default teams.
     * 
     * @returns {Promise<void>} 
     * @memberof CITeamsRepo
     */
    public async InitDefaults(): Promise<void> {
        // Checks whether there is any existing category already.
        const existing_cagegories: DBArticleCategory[] = await this.repository.find();

        // If there are no teams defined, define the common categories that will always exist in the application by easily bootstrapping them.
        if (existing_cagegories.length < 4) {
            const NEWS: DBArticleCategory = new DBArticleCategory();
            NEWS.name = "Notizie";
            NEWS.color = "#f4b042"

            const TUTORIAL: DBArticleCategory = new DBArticleCategory();
            TUTORIAL.name = "Tutorial";
            TUTORIAL.color = "#533696"

            const ANNUNCI: DBArticleCategory = new DBArticleCategory();
            ANNUNCI.name = "Annunci";
            ANNUNCI.color = "#7fc435"

            const INTERVISTE: DBArticleCategory = new DBArticleCategory();
            INTERVISTE.name = "Interviste";
            INTERVISTE.color = "#31b2b0"

            await this.repository.save(ANNUNCI);
            await this.repository.save(NEWS);
            await this.repository.save(TUTORIAL);
            await this.repository.save(INTERVISTE);
        }
        // Once everything is correctly set, safely resolve the promise.
        return;
    }

    /**
     * Get all the cagtegories
     * 
     * @returns {Promise<DBArticleCategory[]>} 
     * @memberof CIArticleCategoriesRepository
     */
    public async findCategories(): Promise<DBArticleCategory[]> {
        return await this.repository.find();
    }

    //Find category by id
    public async findCategoryById(id: number): Promise<DBArticleCategory> {
        return await this.repository.findOne({id:id});
    }

}