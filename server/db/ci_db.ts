import { DB } from "./database";
import { Repository, FindOneOptions } from "typeorm";
import { DB_Team } from './entity/db.team';
import { keys } from '../secrets/keys';
/**
 * Handles the database connection, extending the default database class.
 * 
 * @export
 * @class CI_DB
 * @extends {DB}
 */
export class CI_DB extends DB {
  constructor() {
    super();
  }

  /**
   * Instantiate the default database tables and stuff.
   * 
   * @returns {Promise<void>} 
   * @memberof CI_DB
   */
  public async initDefaultValues(): Promise<void> {
    try {
      console.log('attempting to connect to the database');
      const conn = await this.connect();
      console.log('apparently done connecting');

      const team_repo: Repository<DB_Team> = conn.getRepository(DB_Team);
    
      const teams = await team_repo.find();
      if (teams.length === 0) {
        await this.initTeam(team_repo);
      }

    }
    catch (e) {
      console.error('Exception occurred.');
      console.error(e);
    }
  }

  protected async initTeam(repo: Repository<DB_Team>): Promise<void> {
    const ADMIN_TEAM = new DB_Team();
    ADMIN_TEAM.name = "Admin";
    ADMIN_TEAM.shortname = "drago";
    ADMIN_TEAM.users = [];
    repo.save(ADMIN_TEAM);

    const DELEGATE_TEAM = new DB_Team();
    DELEGATE_TEAM.name = "Delegato WCA";
    DELEGATE_TEAM.shortname = "board";
    DELEGATE_TEAM.users = [];
    repo.save(DELEGATE_TEAM);

    return;
  }
}