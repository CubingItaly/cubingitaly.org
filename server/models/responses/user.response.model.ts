import { autoserialize } from 'cerialize';
import { IGenericResponse } from '../interfaces/IGenericResponse';
import { RESPONSE_STATUS } from '../enums/response.statuses';
import { CIUser } from '../ci.user.model';


export class UserResponse implements IGenericResponse {
 
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
     * Nullable array containing the list of the users
     * 
     * @type {CIUser}
     * @memberof UserResponse
     */
    @autoserialize public user: CIUser;

}
