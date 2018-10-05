import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { ArticleCategoryEntity } from "../entity/category.entity";


@EntityRepository(ArticleCategoryEntity)
export class ArticleCategoryRepository extends BaseCommonRepository<ArticleCategoryEntity> {

    private categories: { id: string, name: string, color: string }[] = [
        {
            id: "news",
            name: "News",
            color: "#ffffff"
        },
        {
            id: "tutorial",
            name: "Tutorial",
            color: "#ffffff"
        },
        {
            id: "interviste",
            name: "Interviste",
            color: "#ffffff"
        }
    ];

    /**
     *
     *
     * @type {string}
     * @memberof UserRepository
     */
    public _entityIdentifier: string = "ArticleCategoryEntity";


    /**
     * Init the categories table in the database.
     * If the default categories do not exist, they are added.
     *
     * @returns {Promise<void>}
     * @memberof ArticleCategoryRepository
     */
    public async InitDefaults(): Promise<void> {
        let exist: boolean = false;
        let category: ArticleCategoryEntity = new ArticleCategoryEntity();

        for (const c of this.categories) {
            exist = await this.checkIfCategoryExist(c.id);
            if (!exist) {
                category.id = c.id;
                category.name = c.name;
                category.color = c.color;
                await this.repository.save(category);
            }
        }
        return;
    }


    private async checkIfCategoryExist(id: string) {
        let category: ArticleCategoryEntity[] = await this.repository.find({ where: { id: id } });
        return (category.length > 0);
    }

    /**
     * Return all the roles in the database
     *
     * @returns {Promise<ArticleCategoryEntity[]>}
     * @memberof ArticleCategoryRepository
     */
    public async getCategories(): Promise<ArticleCategoryEntity[]> {
        return this.repository.find();
    }

    /**
     * Return a category, if it doesn't exist return null.
     *
     * @param {string} id
     * @returns {Promise<ArticleCategoryEntity>}
     * @memberof ArticleCategoryRepository
     */
    public async getCategory(id: string): Promise<ArticleCategoryEntity> {
        return this.repository.findOne(id);
    }

}