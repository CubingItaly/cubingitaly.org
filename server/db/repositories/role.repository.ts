import { EntityRepository } from "typeorm";
import { RoleEntity } from "../entity/role.entity";
import { BaseCommonRepository } from "../BaseCommonRepository";

@EntityRepository(RoleEntity)
export class RoleRepository extends BaseCommonRepository<RoleEntity>{

    public _entityIdentifier = "RoleEntity";

    public async InitDefaults(): Promise<void> {
        return;
    }

}