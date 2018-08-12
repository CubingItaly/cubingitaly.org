import { EntityRepository } from "typeorm";
import { RoleEntity } from "../entity/role.entity";
import { BaseCommonRepository } from "../BaseCommonRepository";
import { UserEntity } from "../entity/user.entity";
import { TeamEntity } from "../entity/team.entity";

@EntityRepository(RoleEntity)
export class RoleRepository extends BaseCommonRepository<RoleEntity>{

    public _entityIdentifier = "RoleEntity";

    public async InitDefaults(): Promise<void> {
        return;
    }

    private async getRole(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        return (await this.repository.find({ where: { team: team, user: user } }))[0];
    }

    public async checkIfRoleExist(user: UserEntity, team: TeamEntity): Promise<boolean> {
        let role: RoleEntity[] = await this.repository.find({ where: { team: team, user: user } });
        return role.length > 0;
    }

    public async addRole(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        if (!exist) {
            let tmp: RoleEntity = new RoleEntity();
            tmp.isLeader = false;
            tmp.user = user;
            tmp.team = team;
            return await this.repository.save(tmp);
        }
        return await this.getRole(user, team);
    }

    public async removeRole(user: UserEntity, team: TeamEntity): Promise<void> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        if (exist) {
            let tmp: RoleEntity = await this.getRole(user, team);
            await this.repository.remove(tmp);
        }
        return;
    }


    public async addLeader(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        let tmp: RoleEntity = new RoleEntity();
        if (!exist) {
            tmp.user = user;
            tmp.team = team;
        } else {
            tmp = await this.getRole(user, team);
        }
        tmp.isLeader = true;
        return await this.repository.save(tmp);
    }

    public async removeLeader(user: UserEntity, team: TeamEntity): Promise<void> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        if (exist) {
            let tmp: RoleEntity = await this.getRole(user, team);
            tmp.isLeader = false;
            this.repository.save(tmp);
        }
        return;
    }

}