import { DB_User } from "../entity/db.user";
import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository, getRepository, getCustomRepository } from "typeorm";
import { DB_Team } from "../entity/db.team";
import { ci_teams_repo } from "./ci_teams_repo";
import { DB_TeamUser } from "../entity/db.team_user";

/**
 * Defines the cubing italy users repository default helper.
 * This extends the default behavior of a BaseCommonRepository, inheriting common methods.
 * 
 * @export
 * @class ci_users_repo
 * @extends {BaseCommonRepository<DB_User>}
 */
@EntityRepository(DB_User)
export class ci_users_repo extends BaseCommonRepository<DB_User> {
  /**
   * Sets the entity identifier.
   * Sounds useful for whatever kind of reflection.
   * 
   * @type {string}
   * @memberof ci_users_repo
   */
  public _entityIdentifier: string = "DB_User";

  /**
   * Inits some default users.
   * 
   * @returns {Promise<void>} 
   * @memberof ci_users_repo
   */
  public async InitDefaults(): Promise<void> {
    return;
  }

  /**
   * Returns a user by id.
   * 
   * @param {number} id 
   * @returns {Promise<DB_User>} 
   * @memberof ci_users_repo
   */
  public async findUserById(id: number): Promise<DB_User> {
    return await this.repository.findOneById(id);
  }

  /**
   * Returns all the users that belongs to the provided team.
   * 
   * @param {DB_Team} team 
   * @returns 
   * @memberof ci_users_repo
   */
  public async findAllByTeam(team: DB_Team) {
    return await this.repository
          .createQueryBuilder("user")
          .innerJoinAndSelect("user.teams", "teams")
          .where("teams.team = :team", {
            team: team.id
          }).getMany();
  }
}