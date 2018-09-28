import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private baseAPI: string = "/api/v0/"
  constructor(private http: HttpClient) { }

  public getTeams(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(this.baseAPI + "teams").pipe(map(res => res.map(t => Deserialize(t, TeamModel))));
  }
}
