import { DB } from "./database";
import { Repository, FindOneOptions, getCustomRepository } from "typeorm";
import { DB_Team } from './entity/db.team';
import { keys } from '../secrets/keys';
import { DB_User } from "./entity/db.user";
import { ci_teams_repo } from "./repositories/ci_teams_repo";
import { ci_users_repo } from "./repositories/ci_users_repo";
import { _BOOTSTRAPS } from "./__bootstraps";

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

      await (async function looper(current, max){
        if (current >= max) {
          return;
        }
        else {
          console.log('loooping');
          await _BOOTSTRAPS()[current].InitDefaults();
          looper(current + 1, max);
        }
      })(0, _BOOTSTRAPS().length);
      /*
      _BOOTSTRAPS().forEach(async (repo) => {
        console.log('calling init on repo: ' + repo._entityIdentifier);
        await repo.InitDefaults();
      });
      */
      console.log('should be after all loopings');

      // Just for test purposes, this stuff will be removed later.
      const users_repo: ci_users_repo = getCustomRepository(ci_users_repo);
      const team_repo: ci_teams_repo = getCustomRepository(ci_teams_repo);
      const admin_users: DB_User[] = await users_repo.findAllByTeam(await team_repo.getAdminTeam());
      console.log('admin_users are:');
      console.log(admin_users);
    }
    catch (e) {
      console.error('Exception occurred.');
      console.error(e);
    }
  }
}