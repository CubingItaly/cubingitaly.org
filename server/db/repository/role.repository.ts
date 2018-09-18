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
        return (await this.repository.find({ where: { team: team, user: user }, relations: ["user", "team"] }))[0];
    }

    private async checkIfRoleExist(user: UserEntity, team: TeamEntity): Promise<boolean> {
        let role: RoleEntity[] = await this.repository.find({ where: { team: team, user: user } });
        return role.length > 0;
    }

    /**
     * Create a role with a UserEntity and a TeamEntity
     * If the role already exists return it.
     * If it doesn't exist, create with isLeader false
     *
     * @param {UserEntity} user
     * @param {TeamEntity} team
     * @returns {Promise<RoleEntity>}
     * @memberof RoleRepository
     */
    public async addRole(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        if (!exist) {
            let tmp: RoleEntity = new RoleEntity();
            tmp.isLeader = false;
            tmp.user = user;
            tmp.team = team;
            return this.repository.save(tmp);
        }
        return this.getRole(user, team);
    }

    /**
     * Remove a role.
     * Either if the role exists or not return null.
     *
     * @param {UserEntity} user
     * @param {TeamEntity} team
     * @returns {Promise<void>}
     * @memberof RoleRepository
     */
    public async removeRole(user: UserEntity, team: TeamEntity): Promise<void> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        if (exist) {
            let tmp: RoleEntity = await this.getRole(user, team);
            await this.repository.remove(tmp);
        }
        return;
    }

    /**
     * Promote a user to leader of a group.
     * If a role doesn't exist yet it is created.
     * If a role already exist it is updated with isLeader true.
     *
     * @param {UserEntity} user
     * @param {TeamEntity} team
     * @returns {Promise<RoleEntity>}
     * @memberof RoleRepository
     */
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
        return this.repository.save(tmp);
    }

    /**
     * Demote a leader to simple member of a team.
     * If the role doesn't exist or if the user is just a member 
     * return the null (in the first case) or the role (in the second one).
     *
     * @param {UserEntity} user
     * @param {TeamEntity} team
     * @returns {Promise<RoleEntity>}
     * @memberof RoleRepository
     */
    public async removeLeader(user: UserEntity, team: TeamEntity): Promise<RoleEntity> {
        let exist: boolean = await this.checkIfRoleExist(user, team);
        if (exist) {
            let tmp: RoleEntity = await this.getRole(user, team);
            tmp.isLeader = false;
            return await this.repository.save(tmp);
        }
        return;
    }

}