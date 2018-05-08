import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { DBTeam } from "../entity/db.team";

/**
 * Defines the cubing italy teams custom repository.
 * 
 * @export
 * @class CITeamsRepo
 * @extends {BaseCommonRepository<DBTeam>}
 */
@EntityRepository(DBTeam)
export class CITeamsRepo extends BaseCommonRepository<DBTeam> {
  /**
   * Sets the entity identifier.
   * Sounds useful for whatever kind of reflection.
   * 
   * @type {string}
   * @memberof CITeamsRepo
   */
  public _entityIdentifier: string = "DBTeam";

  public static ADMIN_TEAM_IDENTIFIER: string = "admin";
  public static BOARD_TEAM_IDENTIFIER: string = "board";
  public static CITC_TEAM_IDENTIFIER: string = "citc";
  public static CITI_TEAM_IDENTIFIER: string = "citi";
  public static CITQ_TEAM_IDENTIFIER: string = "citq";


  /**
   * Returns the admin team database entry.
   * 
   * @returns {Promise<DB_Team>} 
   * @memberof CITeamsRepo
   */
  public async getAdminTeam(): Promise<DBTeam> {
    return await this.repository.findOne({
      where: {
        id: CITeamsRepo.ADMIN_TEAM_IDENTIFIER
      }
    });
  }

  public async getBoardTeam(): Promise<DBTeam> {
    return await this.repository.findOne({
      where: {
        id: CITeamsRepo.BOARD_TEAM_IDENTIFIER
      }
    })
  }

  public async getCITCTeam(): Promise<DBTeam> {
    return await this.repository.findOne({
      where: {
        id: CITeamsRepo.CITC_TEAM_IDENTIFIER
      }
    })
  }

  public async getCITITeam(): Promise<DBTeam> {
    return await this.repository.findOne({
      where: {
        id: CITeamsRepo.CITI_TEAM_IDENTIFIER
      }
    })
  }

  public async getCITQTeam(): Promise<DBTeam> {
    return await this.repository.findOne({
      where: {
        id: CITeamsRepo.CITQ_TEAM_IDENTIFIER
      }
    })
  }

  /**
   * Inits some default teams.
   * 
   * @returns {Promise<void>} 
   * @memberof CITeamsRepo
   */
  public async InitDefaults(): Promise<void> {
    // Checks whether there is any existing team already.
    const existing_teams: DBTeam[] = await this.repository.find();

    // If there are no teams defined, define the common teams that will always exist in the application by easily bootstrapping them.
    if (existing_teams.length === 0) {
      const ADMIN_TEAM = new DBTeam();
      ADMIN_TEAM.name = "Admin";
      ADMIN_TEAM.id = "admin";
      await this.manager.save(ADMIN_TEAM);

      const BOARD_TEAM = new DBTeam();
      BOARD_TEAM.name = "Cubing Italy Board";
      BOARD_TEAM.id = "board";
      await this.manager.save(BOARD_TEAM);

      const CITC_TEAM = new DBTeam();
      CITC_TEAM.name = "Cubing Italy Team Comunicazione";
      CITC_TEAM.id = "citc";
      await this.manager.save(CITC_TEAM);

      const CITI_TEAM = new DBTeam();
      CITI_TEAM.name = "Cubing Italy Team Informatico";
      CITI_TEAM.id = "citi";
      await this.manager.save(CITI_TEAM);

      const CITQ_TEAM = new DBTeam();
      CITQ_TEAM.name = "Cubing Italy Team Qualità";
      CITQ_TEAM.id = "citq";
      await this.manager.save(CITQ_TEAM);
    }
    // Once everything is correctly set, safely resolve the promise.
    return;
  }

  public async findTeams(): Promise<DBTeam[]> {
    return await this.repository.find();
  }

  public async findTeamById(id: string): Promise<DBTeam> {
    return await this.repository.findOneById(id);
  }
}