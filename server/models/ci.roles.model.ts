import { autoserialize } from 'cerialize';

/**
 * Auxiliar class used to represent the team membership
 * 
 * @export
 * @class CIRole
 */
export class CIRole {

    /**
     * Represents the team id
     * 
     * @type {string}
     * @memberof CIRole
     */
    @autoserialize public team: string;
    
    /**
     * Boolean value, true if the user is leader of the team
     * 
     * @type {boolean}
     * @memberof CIRole
     */
    @autoserialize public leader: boolean;
}