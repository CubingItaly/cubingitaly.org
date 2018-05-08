import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository, getCustomRepository } from "typeorm";
import { DBRole } from "../entity/db.role";
import { DBUser } from "../entity/db.user";
import { DBTeam } from "../entity/db.team";
import { CIUser } from "../../models/ci.user.model";
import { CiUsersRepo } from "./db.ci.users.repo";
import { CITeam } from "../../models/ci.team.model";
import { CITeamsRepo } from "./db.ci.teams.repo";

/**
 * Repository to handle users' roles
 * 
 * @export
 * @class CIRolesRepo
 * @extends {BaseCommonRepository<DBRole>}
 */
@EntityRepository(DBRole)
export class CIRolesRepo extends BaseCommonRepository<DBRole> {

    public _entityIdentifier: string = "DBRole";

    public async InitDefaults(): Promise<void> {
        return;
    }

    /**
     * Finds all the roles of an user
     * 
     * @param {DBUser} user 
     * @returns {Promise<DBRole[]>} 
     * @memberof CIRolesRepo
     */
    public async findUserRoles(user: DBUser): Promise<DBRole[]> {
        return await this.repository.find({ member: user });
    }

    /**
     * Checks whether the given user belongs to a specific team
     * 
     * @param {DBUser} user 
     * @param {DBTeam} team 
     * @returns 
     * @memberof CIRolesRepo
     */
    public async checkIfUserHasRole(user: DBUser, team: DBTeam): Promise<boolean> {
        let role: DBRole[] = await this.repository.find({ member: user, team: team });
        console.log("roles found:", role);
        return role.length > 0 ? true : false;
    }


    public async checkIfUserIsLeader(user: DBUser, team: DBTeam): Promise<boolean> {
        let hasRole: boolean = await this.checkIfUserHasRole(user, team);
        if (hasRole) {
            let role: DBRole = await this.repository.findOne({ member: user, team: team });
            return role.leader;
        }
        return false;
    }

    /**
     * Adds an user to a new team
     * 
     * @param {DBUser} user 
     * @param {DBTeam} team 
     * @param {boolean} leader 
     * @memberof CIRolesRepo
     */
    public async addRole(user: DBUser, team: DBTeam, leader: boolean): Promise<DBRole> {
        let db_role = new DBRole();
        db_role.member = user;
        db_role.team = team;
        db_role.leader = leader;

        return await this.repository.save(db_role);
    }

    /**
     * Removes an user from a team
     * 
     * @param {DBUser} user 
     * @param {DBTeam} team 
     * @memberof CIRolesRepo
     */
    public async removeRole(user: DBUser, team: DBTeam): Promise<void> {
        let db_role: DBRole = await this.repository.createQueryBuilder("role")
                .innerJoinAndSelect("role.member", "member")
                .innerJoinAndSelect("role.team", "team")
                .where("member.id = :member and team.id = :team", {member: user.id, team: team.id})
                .getOne();
        console.log("found", db_role);
        await this.repository.delete(db_role);
        return;
    }

    public async promoteLeader(user: DBUser, team: DBTeam): Promise<DBRole> {
        let hasRole: boolean = await this.checkIfUserHasRole(user, team);
        if (hasRole) {
            let role: DBRole = new DBRole();
            role.leader = true;
            role.member = user;
            role.team = team;

            return await this.repository.save(role);
        }
        return;
    }


    public async demoteLeader(user: DBUser, team: DBTeam): Promise<DBRole> {
        let hasRole: boolean = await this.checkIfUserHasRole(user, team);
        if (hasRole) {
            let role: DBRole = new DBRole();
            role.leader = false;
            role.member = user;
            role.team = team;

            return await this.repository.save(role);
        }
        return;
    }
}