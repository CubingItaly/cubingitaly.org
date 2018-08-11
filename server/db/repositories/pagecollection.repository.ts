import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { PageCollectionEntity } from "../entity/pagecollection.entity";


/**
 *
 *
 * @export
 * @class UserRepository
 * @extends {BaseCommonRepository<UserEntity>}
 */
@EntityRepository(PageCollectionEntity)
export class PageCollectionRepository extends BaseCommonRepository<PageCollectionEntity> {

    /**
     *
     *
     * @type {string}
     * @memberof UserRepository
     */
    public _entityIdentifier: string = "PageCollectionEntity";


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