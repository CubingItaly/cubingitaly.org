import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { Observable } from 'rxjs';
import { UserModel } from '../../../../../server/models/classes/user.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiBase: string = "/api/v0/teams";
  public teams: TeamModel[];

  constructor(private http: HttpClient) {
  }

  public getTeamsList(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(this.apiBase);
  }

  public getTeamById(id:string): Observable<TeamModel>{
    return this.http.get<TeamModel>(this.apiBase+"/"+id);
  }

  public getTeamMembers(id:string): Observable<UserModel[]>{
    return this.http.get<UserModel[]>(this.apiBase+"/"+id+"/members");
  }

  private handleError(error: HttpErrorResponse) {
    console.log("an error occurred");
  }
}
