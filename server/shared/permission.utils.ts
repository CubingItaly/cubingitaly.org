
import { UserModel } from "../models/classes/user.model";
import * as loginUtils from "./login.utils";
import { TeamModel } from "../models/classes/team.model";


/**
 * Return true if the user can admin teams, false otherwise
 *
 * @param {Request} req
 * @returns {boolean}
 */
export function canAdminTeams(req: Request): boolean {
    let user: UserModel = loginUtils.getUser(req);
    return user.canAdminTeams();
}


/**
 * Return true if the user can manage the team
 *
 * @param {*} req
 * @param {TeamModel} team
 * @returns {boolean}
 */
export function canManageTeam(req: Request, team: TeamModel): boolean {
    let user: UserModel = loginUtils.getUser(req);
    return user.canManageTeam(team);
}