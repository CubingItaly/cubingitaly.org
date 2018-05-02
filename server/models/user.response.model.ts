import { autoserialize } from 'cerialize';
import { IGenericResponse } from './interfaces/IGenericResponse';
import { RESPONSE_STATUS } from './enums/response.statuses';
import { CIUser } from './ci.user.model';

/**
 * Represents the class of the standard response which is used to send info to the client
 */
export class UserResponse implements IGenericResponse {
 
    /**
     * Boolean which indicates the result of the request
     * 
     * @type {RESPONSE_STATUS}
     * @memberof standard_response
     */
    @autoserialize public status: RESPONSE_STATUS;

    /**
     * Nullable string that contains the error message in case of negative result
     * 
     * @type {string}
     * @memberof standard_response
     */
    @autoserialize public error: string;

    /**
     * Nullable object that contains the user data
     * 
     * @type {wca_user}
     * @memberof standard_response
     */
    @autoserialize public user: CIUser;

}
