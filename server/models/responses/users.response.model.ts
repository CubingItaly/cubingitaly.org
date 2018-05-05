import { autoserialize } from 'cerialize';
import { IGenericResponse } from '../interfaces/IGenericResponse';
import { RESPONSE_STATUS } from '../enums/response.statuses';
import { CIUser } from '../ci.user.model';


export class UsersResponse implements IGenericResponse {
 
    /**
     * Object that contains the status of the response
     * 
     * @type {RESPONSE_STATUS}
     * @memberof UsersResponse
     */
    @autoserialize public status: RESPONSE_STATUS;

    /**
     * Nullable string that contains the error message in case of negative result
     * 
     * @type {string}
     * @memberof UsersResponse
     */
    @autoserialize public error: string;

    /**
     * Nullable array containing the list of the users
     * 
     * @type {CIUser[]}
     * @memberof UsersResponse
     */
    @autoserialize public users: CIUser[];

}
