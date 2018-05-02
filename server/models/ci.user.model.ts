import { autoserialize } from 'cerialize';
import { CITeam } from './ci.team.model';
import { CIRole } from './ci.roles.model';

/**
 * Class to handle the Users
 * 
 * @export
 * @class CIUser
 */
export class CIUser {

  /**
   * User's unique ID
   * 
   * @type {number}
   * @memberof CIUser
   */
  @autoserialize public id: number;

  /**
   * User's WCA ID, is null if he doesn't have one
   * 
   * @type {string}
   * @memberof CIUser
   */
  @autoserialize public wca_id: string;

  /**
   * User's name
   * 
   * @type {string}
   * @memberof CIUser
   */
  @autoserialize public name: string;

  /**
   * User's email
   * 
   * @type {string}
   * @memberof CIUser
   */
  @autoserialize public email: string;

  /**
   * Handles the delegate status
   * 
   * @type {string}
   * @memberof CIUser
   */
  @autoserialize public delegate_status: string;

  /**
   * Represents the roles of the user
   * 
   * @type {CIRole[]}
   * @memberof CIUser
   */
  @autoserialize public roles: CIRole[];

  /**
   * Checks whether the user is delegate or not
   * 
   * @returns {boolean} 
   * @memberof CIUser
   */
  public isDelegate(): boolean {
    return (this.delegate_status != null);
  }

  /** 
  * -----------------------------------------------------------------
  * Role membership controls
  * -----------------------------------------------------------------
  */

  /**
   * Checks whether the user is leader of the given team
   * 
   * @param {CITeam} team 
   * @returns {boolean} 
   * @memberof CIUser
   */
  private isMemberOf(team: CITeam): boolean {
    let teamIndex: number = this.roles.findIndex(t => t.team === team.id);
    return teamIndex >= 0 ? true : false;
  }

  /**
 * Checks whether the user is member of the given team
 * 
 * @param {CITeam} team 
 * @returns {boolean} 
 * @memberof CIUser
 */
  private isLeaderOf(team: CITeam): boolean {
    let teamIndex: number = this.roles.findIndex(t => t.team === team.id);
    if (teamIndex >= 0) {
      return this.roles[teamIndex].leader;
    }
    return false;
  }

  /**
   * Checks whether the use belongs to the admin team
   * 
   * @returns {boolean} 
   * @memberof CIUser
   */
  private isAdmin(): boolean {
    return this.roles.findIndex(t => t.team === "admin") >= 0;
  }

  /**
  * Checks whether the use belongs to the board team
  * 
  * @returns {boolean} 
  * @memberof CIUser
  */
  private isBoard(): boolean {
    return this.roles.findIndex(t => t.team === "board") >= 0;
  }

  /**
  * Checks whether the use belongs to the CITI team
  * 
  * @returns {boolean} 
  * @memberof CIUser
  */
  private isCITI(): boolean {
    return this.roles.findIndex(t => t.team === "citi") >= 0;
  }

  /**
  * Checks whether the use belongs to the CITC team
  * 
  * @returns {boolean} 
  * @memberof CIUser
  */
  private isCITC(): boolean {
    return this.roles.findIndex(t => t.team === "citc") >= 0;
  }

  /**
  * Checks whether the use belongs to the CITQ team
  * 
  * @returns {boolean} 
  * @memberof CIUser
  */
  private isCITQ(): boolean {
    return this.roles.findIndex(t => t.team === "citq") >= 0;
  }


  /**
   * -----------------------------------------------------------------
   * Permissions management 
   * -----------------------------------------------------------------
   */

  public canAdminUsers(): boolean {
    return this.isAdmin() || this.isBoard();
  }

  public canManageTeam(team: CITeam): boolean {
    return this.isLeaderOf(team);
  }
}