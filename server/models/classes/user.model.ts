import { autoserialize, autoserializeAs } from 'cerialize';
import { TeamModel } from './team.model';
import { RoleModel } from './role.model';


/**
 *
 * @export
 * @class UserModel
 */
export class UserModel {

    /**
     * Unique user id, same as on the WCA website
     *
     * @type {number}
     * @memberof UserModel
     */
    @autoserialize
    public id: number;


    /**
     * User's WCA ID, it can be null if the person hasn't ever competed in an official WCA competition
     *
     * @type {string}
     * @memberof UserModel
     */
    @autoserialize
    public wca_id: string;


    /**
     * Users's full name, same as on the WCA website
     *
     * @type {string}
     * @memberof UserModel
     */
    @autoserialize
    public name: string;


    /**
     * A string that represents the Delegate Status of the user
     * It Can be 'Delegate', 'Candidate Delegate' or null
     *
     * @type {string}
     * @memberof UserModel
     */
    @autoserialize
    public delegate_satus: string;


    /**
     * The roles of the user 
     * 
     * @type {RoleModel[]}
     * @memberof UserModel
     */
    @autoserializeAs(RoleModel)
    public roles: RoleModel[] = [];


    /** -------------------------------
     * Methods
     * ---------------------------- **/


    /**
     * Returns true if the user is equale to the parameter one
     *
     * @param {UserModel} user
     * @returns {boolean}
     * @memberof UserModel
     */
    public equals(user: UserModel): boolean {
        return this.id === user.id;
    }


    /**
     * Returns true if the user is a Delegate, false otherwise
     *
     * @returns {boolean}
     * @memberof UserModel
     */
    public isDelegate(): boolean {
        return (this.delegate_satus !== undefined && this.delegate_satus !== null);
    }


    /**
     * Checks whether the user is member of a team
     * Return true if so, false otherwise
     *
     * @param {TeamModel} team
     * @returns {boolean}
     * @memberof UserModel
     */
    public isMemberOf(team: TeamModel): boolean {
        let index: number = this.roles.findIndex((r: RoleModel) => (r.team === team.id));
        return (index >= 0);
    }


    /**
     *
     * Checks whether the user is leader of a team
     * Return true if so, false otherwise
     *
     * @param {TeamModel} team
     * @returns {boolean}
     * @memberof UserModel
     */
    public isLeaderOf(team: TeamModel): boolean {
        return this.isMemberOf(team) && this.roles.find((r: RoleModel) => r.team === team.id).isLeader;
    }


    /**
   * Checks whether the use belongs to the admin team
   * 
   * @returns {boolean} 
   * @memberof UserModel
   */
    private isAdmin(): boolean {
        return this.roles.findIndex(t => t.team === "admin") >= 0;
    }

    /**
    * Checks whether the use belongs to the board team
    * 
    * @returns {boolean} 
    * @memberof UserModel
    */
    private isBoard(): boolean {
        return this.roles.findIndex(t => t.team === "board") >= 0;
    }

    /**
    * Checks whether the use belongs to the CITI team
    * 
    * @returns {boolean} 
    * @memberof UserModel
    */
    private isCITI(): boolean {
        return this.roles.findIndex(t => t.team === "citi") >= 0;
    }

    /**
    * Checks whether the use belongs to the CITC team
    * 
    * @returns {boolean} 
    * @memberof UserModel
    */
    private isCITC(): boolean {
        return this.roles.findIndex(t => t.team === "citc") >= 0;
    }

    /**
    * Checks whether the use belongs to the CITQ team
    * 
    * @returns {boolean} 
    * @memberof UserModel
    */
    private isCITQ(): boolean {
        return this.roles.findIndex(t => t.team === "citq") >= 0;
    }


    /**
     * -----------------------------------------------------------------
     * Permissions
     * -----------------------------------------------------------------
     */

    public canAdminUsers(): boolean {
        return this.isAdmin() || this.isBoard();
    }

    public canAdminTeams(): boolean {
        return this.isAdmin() || this.isBoard();
    }

    public canManageTeam(team: TeamModel): boolean {
        return this.isLeaderOf(team) || this.canAdminTeams();
    }

    public canAdminArticles(): boolean {
        return this.isAdmin() || this.isBoard() || this.isCITC();
    }

    public canEditArticles(): boolean {
        return this.canAdminArticles() || this.isCITQ() || this.isCITI();
    }
}