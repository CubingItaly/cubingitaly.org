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
    public delegate_status: string;


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
     * Returns true if the user is a Delegate, false otherwise
     *
     * @returns {boolean}
     * @memberof UserModel
     */
    public isDelegate(): boolean {
        return (this.delegate_status !== undefined && this.delegate_status !== null);
    }


    /**
     * Checks whether the user is member of a team
     * Return true if so, false otherwise
     *
     * @param {TeamModel} team
     * @returns {boolean}
     * @memberof UserModel
     */
    public isMemberOf(team: string): boolean {
        let index: number = this.roles.findIndex((r: RoleModel) => (r.team === team));
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
    public isLeaderOf(team: string): boolean {
        return this.isMemberOf(team) && this.roles.find((r: RoleModel) => r.team === team).isLeader;
    }

    private isLeader(): boolean {
        return (this.roles.findIndex(r => r.isLeader === true) >= 0);
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

    /* Start of teams permissions */
    public canAdminTeams(): boolean {
        return this.isAdmin() || this.isBoard();
    }

    public canManageTeam(team: TeamModel): boolean {
        return this.isLeaderOf(team.id) || this.canAdminTeams();
    }

    public canManageTeams(): boolean {
        return this.canAdminTeams() || this.isLeader();
    }
    /* End of teams permissions */


    /* Start of articles permissions */
    public canAdminArticles(): boolean {
        return this.isAdmin() || this.isBoard() || this.isCITC() || this.isLeaderOf("citi");
    }

    public canEditArticles(): boolean {
        return this.canAdminArticles() || this.isCITQ() || this.isCITI();
    }
    /* Emd of articles permissions */


    /* Start of tutorial permissions */
    public canAdminTutorials(): boolean {
        return this.isAdmin() || this.isBoard() || this.isLeaderOf("citi") || this.isLeaderOf("citc");
    }

    public canCreateTutorials(): boolean {
        return this.canAdminTutorials() || this.isCITI();
    }

    public canPublishTutorials(): boolean {
        return this.canAdminTutorials() || this.isCITC() || this.isLeaderOf("citq");
    }

    public canEditPages(): boolean {
        return this.canCreateTutorials() || this.isCITI() || this.isCITQ() || this.isCITC();
    }
    /* End of tutorial permissions */
}