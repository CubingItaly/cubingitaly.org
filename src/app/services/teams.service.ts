import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CITeam } from "../../../server/models/ci.team.model";
import { Observable } from "rxjs/Observable";
import { Deserialize } from "cerialize";
import { TeamResponse } from "../../../server/models/responses/teams.response.model";

@Injectable()
export class TeamsService {
    protected baseUri: string = '/teams';

    constructor(private http: HttpClient) {
    }

    /**
     * Returns the list of existing teams.
     * 
     * @returns {Promise<CITeam[]>} 
     * @memberof TeamsService
     */
    public async list(): Promise<CITeam[]> {
      return await this.http.get(this.baseUri + '/teamsList').map((r: TeamResponse) => {
        return r.teamsList.map(e => Deserialize(e, CITeam));
      }).toPromise();
    }
}
