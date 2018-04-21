import { DB } from "./database";
import { Repository, FindOneOptions } from "typeorm";
import { Team } from './entity/db.team';
import { User } from "./entity/db.user";
import { TeamUser } from "./entity/db.team_user";
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

      const user_repo: Repository<User> = conn.getRepository(User);
      const team_repo: Repository<Team> = conn.getRepository(Team);
      const teaus_repo: Repository<TeamUser> = conn.getRepository(TeamUser);

      const teams = await team_repo.find();
      if (teams.length === 0) {
        await this.initTeam(team_repo);
      }

      const users = await user_repo.find();
      const roles = await teaus_repo.find();

      if (users.length > 0 && roles.length == 0) {
        await this.giveAdminRole(teaus_repo,team_repo,user_repo);
      }


    }
    catch (e) {
      console.error('Exception occurred.');
      console.error(e);
    }
  }

  protected async initTeam(repo: Repository<Team>): Promise<void> {
    const ADMIN_TEAM = new Team();
    ADMIN_TEAM.name = "Admin";
    ADMIN_TEAM.shortname = "drago";
    ADMIN_TEAM.users = [];
    repo.save(ADMIN_TEAM);

    const DELEGATE_TEAM = new Team();
    DELEGATE_TEAM.name = "Delegato WCA";
    DELEGATE_TEAM.shortname = "board";
    DELEGATE_TEAM.users = [];
    repo.save(DELEGATE_TEAM);

    return;
  }

  protected async giveAdminRole(teaus_repo: Repository<TeamUser>, team_repo: Repository<Team>, user_repo: Repository<User>): Promise<void> {
    const user: User = await user_repo.findOneById(keys.admin.id);
    const team: Team = await team_repo.findOne({ "shortname": keys.admin.shortname });
    const TEAM_USER = new TeamUser();
    TEAM_USER.team = team;
    TEAM_USER.user = user;
    TEAM_USER.is_leader = true;
    teaus_repo.save(TEAM_USER);
    return;
  }
}