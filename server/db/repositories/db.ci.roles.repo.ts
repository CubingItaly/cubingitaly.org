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
        console.log ("roles found:", role);
        return role.length > 0 ? true : false;
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
    public async removeRole(user: DBUser, team: DBTeam): Promise<void>{
        let db_role: DBRole = await this.repository.findOne({ member: user, team: team });
        await this.repository.delete(db_role);
        return;
    }
}