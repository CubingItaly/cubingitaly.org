import { autoserialize, inheritSerialization } from 'cerialize';
import { CITeam } from '../ci.team.model';
import { GenericResponse } from './generic.response.model';

@inheritSerialization(GenericResponse)
export class TeamsResponse extends GenericResponse{
 
    constructor(){
        super();
    }

    /**
     * Nullable array containing the list of Teams
     * 
     * @type {CITeam[]}
     * @memberof UserResponse
     */
    @autoserialize public teams: CITeam[];

}