import { DB } from "./database";
import { _BOOTSTRAPS } from "./__bootstraps";
import { TeamRepository } from "./repositories/team.repository";
import { getTeamRepository, getUserRepository } from "../shared/repository.utils";
import { UserRepository } from "./repositories/user.repository";
import { TeamEntity } from "./entity/team.entity";
import { UserEntity } from "./entity/user.entity";

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

      await this.connect();

      await (async function looper(current, max) {
        if (current >= max) {
          return;
        }
        else {
          await _BOOTSTRAPS()[current].InitDefaults();
          looper(current + 1, max);
        }
      })(0, _BOOTSTRAPS().length);

      console.log('Connected to the database');

      //# warning: The following lines are just for test purpose and they'll be deleted before going on production
      /*let teamRepo: TeamRepository = getTeamRepository();
      let userRepo: UserRepository = getUserRepository();
      let adminTeam: TeamEntity = await teamRepo.getTeamById("admin");
      console.log(adminTeam);
      /let users: UserEntity[] = await userRepo.findUsersByTeam(adminTeam);
      *console.log("Admins:", users);
      */
    }
    catch (e) {
      console.error('Exception occurred.');
      console.error(e);
    }
  }
}