import { DB } from "./database";
import { _BOOTSTRAPS } from "./__bootstraps";
import { TeamRepository } from "./repository/team.repository";
import { UserRepository } from "./repository/user.repository";
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
    }
    catch (e) {
      console.error('Exception occurred.');
      console.error(e);
    }
  }
}