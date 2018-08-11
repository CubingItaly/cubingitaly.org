import { autoserialize, autoserializeAs } from 'cerialize';
import { RoleModel } from './role.model';


/**
 * Represents a Cubing Italy's Team
 *
 * @export
 * @class TeamModel
 */
export class TeamModel {

    /**
     * Unique Team id
     *
     * @type {string}
     * @memberof TeamModel
     */
    @autoserialize
    public id: string;


    /**
     * Full team name
     *
     * @type {string}
     * @memberof TeamModel
     */
    @autoserialize
    public name: string;

    /**
    * The roles associated to the team 
    * 
    * @type {RoleModel[]}
    * @memberof TeamModel
    */
    @autoserializeAs(RoleModel)
    public roles: RoleModel[];


    /**
     * Return true if the team has a leader
     *
     * @returns {boolean}
     * @memberof TeamModel
     */
    public hasLeader(): boolean {
        if (this.roles !== undefined && this.roles !== null) {
            return (this.roles.findIndex((r: RoleModel) => r.isLeader) >= 0);
        }
        return false;
    }

    /**
     * Returns true if the team is equal to the parameter
     *
     * @param {TeamModel} t
     * @returns {boolean}
     * @memberof TeamModel
     */
    public equals(team: TeamModel): boolean {
        return this.id === team.id;
    }
}