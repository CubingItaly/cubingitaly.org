import { autoserialize, inheritSerialization } from 'cerialize';
import { CITeam } from '../ci.team.model';
import { GenericResponse } from './generic.response.model';

@inheritSerialization(GenericResponse)
export class TeamResponse extends GenericResponse {
 
    constructor(){
        super();
    }

    /**
     * Nullable array containing the requested Team
     * 
     * @type {CITeam}
     * @memberof UserResponse
     */
    @autoserialize public team: CITeam;

}