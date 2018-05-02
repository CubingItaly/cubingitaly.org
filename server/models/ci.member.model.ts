import { autoserialize } from 'cerialize';

/**
 * Auxiliar class used in CITeam class that represents team members
 * 
 * @export
 * @class CIMember
 */
export class CIMember {

    /**
     * User id
     * 
     * @type {number}
     * @memberof CIMember
     */
    @autoserialize public id: number;

    /**
     * Boolean value, true if the user is leader of the team
     * 
     * @type {boolean}
     * @memberof CIMember
     */
    @autoserialize public leader: boolean;
}