import { ArticleCategoryRepository } from "../../../db/repository/category.repository";
import { ArticleCategoryEntity } from "../../../db/entity/category.entity";


export class FakeCategoryRepo extends ArticleCategoryRepository {

    public async InitDefaults(): Promise<void> {
        return;
    }

    public async getCategories(): Promise<ArticleCategoryEntity[]> {
        return [];
    }

    public async getCategory(id: string): Promise<ArticleCategoryEntity> {
        if (id === "news") {
            let category: ArticleCategoryEntity = new ArticleCategoryEntity();
            category.id = "news";
            return category;
        }
        return;
    }

}