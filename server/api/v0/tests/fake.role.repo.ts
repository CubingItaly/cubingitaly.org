import { RoleRepository } from "../../../db/repository/role.repository";
import { RoleEntity } from "../../../db/entity/role.entity";
import { UserEntity } from "../../../db/entity/user.entity";
import { TeamEntity } from "../../../db/entity/team.entity";


export class FakeRoleRepo extends RoleRepository {

    public async addRole(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        let tmp: RoleEntity = new RoleEntity();
        tmp.isLeader = false;
        tmp.user = user;
        tmp.team = team;
        return tmp;
    }

    public async removeRole(user: UserEntity, team: TeamEntity): Promise<void> {
        return;
    }

    public async addLeader(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        let tmp: RoleEntity = new RoleEntity();
        tmp.isLeader = true;
        tmp.user = user;
        tmp.team = team;
        return tmp;
    }

    public async removeLeader(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        return await this.addRole(user, team);
    }


}