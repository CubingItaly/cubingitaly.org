import { autoserialize } from 'cerialize';
import { IGenericResponse } from '../interfaces/IGenericResponse';
import { RESPONSE_STATUS } from '../enums/response.statuses';
import { CITeam } from '../ci.team.model';


export class TeamsResponse implements IGenericResponse {
 
    /**
     * Object that contains the status of the response
     * 
     * @type {RESPONSE_STATUS}
     * @memberof UserResponse
     */
    @autoserialize public status: RESPONSE_STATUS;

    /**
     * Nullable string that contains the error message in case of negative result
     * 
     * @type {string}
     * @memberof UserResponse
     */
    @autoserialize public error: string;

    /**
     * Nullable array containing the list of Teams
     * 
     * @type {CITeam[]}
     * @memberof UserResponse
     */
    @autoserialize public teams: CITeam[];

}