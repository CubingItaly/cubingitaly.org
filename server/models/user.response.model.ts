import { autoserialize } from 'cerialize';
import { RESPONSE_STATUS } from './enums/response.statuses';
import { CIUser } from './ci.user.model';
import { GenericResponse } from './responses/generic.response';

/**
 * Represents the class of the standard response which is used to send info to the client
 */
export class UserResponse extends GenericResponse {

    /**
     * Nullable object that contains the user data
     * 
     * @type {wca_user}
     * @memberof standard_response
     */
    @autoserialize public user: CIUser;

}
