import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { ArticleCategoryEntity } from "../entity/category.entity";


/**
 *
 *
 * @export
 * @class UserRepository
 * @extends {BaseCommonRepository<UserEntity>}
 */
@EntityRepository(ArticleCategoryEntity )
export class ArticleCategoryRepository extends BaseCommonRepository<ArticleCategoryEntity> {

    /**
     *
     *
     * @type {string}
     * @memberof UserRepository
     */
    public _entityIdentifier: string = "ArticleCategoryEntity";


    /**
     *
     *
     * @returns {Promise<void>}
     * @memberof UserRepository
     */
    public async InitDefaults(): Promise<void> {
        return;
    }




}