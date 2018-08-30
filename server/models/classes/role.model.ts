import { autoserialize } from 'cerialize';

/**
 * Represents a role of a user within a team of Cubing Italy
 * 
 * @export
 * @class RoleModel
 */
export class RoleModel {


    /**
     * The id of the team involved in the role 
     *
     * @type {string}
     * @memberof RoleModel
     */
    @autoserialize
    public team: string;


    /**
     * The id of the user involved in the role 
     *
     * @type {number}
     * @memberof RoleModel
     */
    @autoserialize
    public user: number;


    /**
     * A boolean value, true if the user is leader of the team
     *
     * @type {boolean}
     * @memberof RoleModel
     */
    @autoserialize
    public isLeader: boolean;


    /**
     * Returns true if the two roles are equal (same user, same team and leadership)
     *
     * @param {RoleModel} r
     * @returns {boolean}
     * @memberof RoleModel
     */
    public equals(r: RoleModel): boolean {
        return (this.isLeader === r.isLeader && this.team === r.team && this.user == r.user);
    }
}