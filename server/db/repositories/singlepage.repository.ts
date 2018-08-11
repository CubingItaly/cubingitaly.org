import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { SinglePageEntity } from "../entity/singlepage.entity";


/**
 *
 *
 * @export
 * @class UserRepository
 * @extends {BaseCommonRepository<UserEntity>}
 */
@EntityRepository(SinglePageEntity)
export class SinglePageRepository extends BaseCommonRepository<SinglePageEntity> {

    /**
     *
     *
     * @type {string}
     * @memberof UserRepository
     */
    public _entityIdentifier: string = "SinglePageEntity";


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