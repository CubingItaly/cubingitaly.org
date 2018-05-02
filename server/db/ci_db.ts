import { DB } from "./database";
import { Repository, FindOneOptions, getCustomRepository } from "typeorm";
import { keys } from '../secrets/keys';
import { _BOOTSTRAPS } from "./__bootstraps";
import { CITeamsRepo } from "./repositories/db.ci.teams.repo";
import { CiUsersRepo } from "./repositories/db.ci.users.repo";
import { DBTeam } from "./entity/db.team";
import { DBUser } from "./entity/db.user";

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

      await (async function looper(current, max) {
        if (current >= max) {
          return;
        }
        else {
          console.log('loooping');
          await _BOOTSTRAPS()[current].InitDefaults();
          looper(current + 1, max);
        }
      })(0, _BOOTSTRAPS().length);

      console.log('should be after all loopings');

      //# warning: The following lines are just for test purpose and they'll be deleted before going on production
      let teams_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
      let users_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
      let admin_team: DBTeam = await teams_repo.getAdminTeam();
      console.log(admin_team);
      let users: DBUser[] = await users_repo.findAllByTeam(admin_team);
      console.log("Admins:", users);
    }
    catch (e) {
      console.error('Exception occurred.');
      console.error(e);
    }
  }
}