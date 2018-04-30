import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { DB_Team } from "../entity/db.team";

/**
 * Defines the cubing italy teams custom repository.
 * 
 * @export
 * @class ci_teams_repo
 * @extends {BaseCommonRepository<DB_Team>}
 */
@EntityRepository(DB_Team)
export class ci_teams_repo extends BaseCommonRepository<DB_Team> {
  /**
   * Sets the entity identifier.
   * Sounds useful for whatever kind of reflection.
   * 
   * @type {string}
   * @memberof ci_teams_repo
   */
  public _entityIdentifier: string = "DB_Team";

  public static ADMIN_TEAM_IDENTIFIER: string = "Admin";
  public static DELEGATE_TEAM_IDENTIFIER: string = "Delegato WCA";

  /**
   * Returns the admin team database entry.
   * 
   * @returns {Promise<DB_Team>} 
   * @memberof ci_teams_repo
   */
  public async getAdminTeam(): Promise<DB_Team> {
    return await this.repository.findOne({
      where: {
        name: ci_teams_repo.ADMIN_TEAM_IDENTIFIER
      }
    });
  }

  public async getDelegateTeam(): Promise<DB_Team> {
    return await this.repository.findOne({
      where: {
        name: ci_teams_repo.DELEGATE_TEAM_IDENTIFIER
      }
    })
  }

  /**
   * Inits some default teams.
   * 
   * @returns {Promise<void>} 
   * @memberof ci_teams_repo
   */
  public async InitDefaults(): Promise<void> {
    // Checks whether there is any existing team already.
    const existing_teams: DB_Team[] = await this.repository.find();

    // If there are no teams defined, define the common teams that will always exist in the application by easily bootstrapping them.
    if (existing_teams.length === 0) {
      const ADMIN_TEAM = new DB_Team();
      ADMIN_TEAM.name = "Admin";
      ADMIN_TEAM.shortname = "drago";
      ADMIN_TEAM.users = [];
      await this.manager.save(ADMIN_TEAM);

      const DELEGATE_TEAM = new DB_Team();
      DELEGATE_TEAM.name = "Delegato WCA";
      DELEGATE_TEAM.shortname = "board";
      DELEGATE_TEAM.users = [];
      await this.manager.save(DELEGATE_TEAM);
    }
    // Once everything is correctly set, safely resolve the promise.
    return;
  } 
}