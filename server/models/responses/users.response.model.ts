import { autoserialize, inheritSerialization } from 'cerialize';
import { CIUser } from '../ci.user.model';
import { GenericResponse } from './generic.response.model';

@inheritSerialization(GenericResponse)
export class UsersResponse extends GenericResponse {


    constructor() {
        super();
    }

    /**
     * Nullable array containing the list of the users
     * 
     * @type {CIUser[]}
     * @memberof UsersResponse
     */
    @autoserialize public users: CIUser[];

}
