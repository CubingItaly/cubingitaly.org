import { autoserialize, inheritSerialization } from 'cerialize';
import { CIUser } from '../ci.user.model';
import { GenericResponse } from './generic.response.model';

@inheritSerialization(GenericResponse)
export class UserResponse extends GenericResponse {

    constructor() {
        super();
    }

    /**
     * Nullable array containing the list of the users
     * 
     * @type {CIUser}
     * @memberof UserResponse
     */
    @autoserialize public user: CIUser;

}
