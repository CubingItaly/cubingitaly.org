import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { ArticleEntity } from "../entity/article.entity";



@EntityRepository(ArticleEntity)
export class ArticleRepository extends BaseCommonRepository<ArticleEntity> {

 
    public _entityIdentifier: string = "ArticleEntity";



    public async InitDefaults(): Promise<void> {
        return;
    }




}