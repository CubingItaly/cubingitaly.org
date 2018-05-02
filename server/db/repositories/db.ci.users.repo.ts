import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository, getRepository, getCustomRepository } from "typeorm";
import { DBTeam } from "../entity/db.team";
import { DBUser } from "../entity/db.user";
import { CIUser } from "../../models/ci.user.model";
import { keys } from "../../secrets/keys"
import { CITeamsRepo } from "./db.ci.teams.repo";
import { CIRolesRepo } from "./db.ci.roles.repo";

/**
 * Defines the cubing italy users repository default helper.
 * This extends the default behavior of a BaseCommonRepository, inheriting common methods.
 * 
 * @export
 * @class ci_users_repo
 * @extends {BaseCommonRepository<DBUser>}
 */
@EntityRepository(DBUser)
export class CiUsersRepo extends BaseCommonRepository<DBUser> {
  /**
   * Sets the entity identifier.
   * Sounds useful for whatever kind of reflection.
   * 
   * @type {string}
   * @memberof CiUsersRepo
   */
  public _entityIdentifier: string = "DBUser";

  /**
   * Inits some default users.
   * 
   * @returns {Promise<void>} 
   * @memberof CiUsersRepo
   */
  public async InitDefaults(): Promise<void> {
    return;
  }

  /**
   * Returns a user by id, including his roles
   * 
   * @param {number} id 
   * @returns {Promise<DBUser>} 
   * @memberof CiUsersRepo
   */
  public async findUserById(id: number) {
    let db_user: DBUser = await this.repository.createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "roles")
      .leftJoinAndSelect("roles.team", "team")
      .where("user.id = :id", { id: id }).getOne();
    console.log(db_user);
    return db_user;
  }

  /**
   * Finds all the users who belong to a team
   * 
   * @param {DBTeam} team 
   * @returns 
   * @memberof CiUsersRepo
   */
  public async findAllByTeam(team: DBTeam) {
    let team_users: DBUser[] = await this.repository.createQueryBuilder("user")
      .innerJoinAndSelect("user.roles", "roles")
      .innerJoinAndSelect("roles.team", "team")
      .where("team.id = :id", { id: team.id })
      .getMany();
    return team_users;
  }


  /**
   * Checks whether the user exists in the database
   * 
   * @param {number} id 
   * @returns 
   * @memberof CiUsersRepo
   */
  public async checkIfUserExists(id: number) {
    let users: DBUser[] = await this.repository.find({ id: id });
    return users.length > 0 ? true : false;
  }


  /**
   * Method used to login an user.
   * If the user already exists, it updates it, if not it is created.
   * If the user should be admin but he is not, he is added to the team.
   * 
   * @param {DBUser} user 
   * @memberof CiUsersRepo
   */
  public async loginUser(user: DBUser) {

    let roles_repo: CIRolesRepo = getCustomRepository(CIRolesRepo);
    await this.repository.save(user);

    //Checks whether the user is admin and if there is the need, adds him to the team.
    if (keys.admin.id == user.id) {
      console.log("user is admin");
      let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
      let admin_team = await team_repo.getAdminTeam();
      let is_admin = await roles_repo.checkIfUserHasRole(user, admin_team);
      console.log("has admin perm", is_admin);
      if (!is_admin) {
        console.log("giving admin role");
        roles_repo.addRole(user, admin_team, true);
      }
    }


  }

  
}