import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CITeam } from '../../../../../server/models/ci.team.model';
import { TeamsResponse } from '../../../../../server/models/responses/teams.response.model';
import { RESPONSE_STATUS } from '../../../../../server/models/enums/response.statuses';
import { Deserialize } from 'cerialize';
import { TeamResponse } from '../../../../../server/models/responses/team.response.model';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { UsersResponse } from '../../../../../server/models/responses/users.response.model';
import { GenericResponse } from '../../../../../server/models/responses/generic.response.model';

@Injectable()
export class TeamsService {

  private baseUri: string = "/api/teams";
  public teams: CITeam[];

  constructor(private http: HttpClient) {
  }

  public async getTeams(): Promise<CITeam[]> {
    return await this.http.get<TeamsResponse>(this.baseUri + "/").map((r: TeamsResponse) => {
      return r.teams.map(t => Deserialize(t, CITeam));
    }).toPromise();
  }

  public async getTeam(team: string): Promise<CITeam> {
    return await this.http.get<TeamResponse>(this.baseUri + "/" + team).map((r: TeamResponse) => {
      return Deserialize(r.team, CITeam);
    }).toPromise();
  }

  public async getTeamMembers(team: string): Promise<CIUser[]> {
    return await this.http.get<UsersResponse>(this.baseUri + "/" + team + "/members").map((r: UsersResponse) => {
      return r.users.map(u => Deserialize(u, CIUser));
    }).toPromise();
  }

  public async getUsersByName(name: string): Promise<CIUser[]> {
    return await this.http.get<UsersResponse>("/api/users?name=" + name).map((r: UsersResponse) => {
      return r.users.map(u => Deserialize(u, CIUser));
    }).toPromise();
  }

  public async addNewMember(team: string, user: CIUser): Promise<void> {
    return await this.http.post<GenericResponse>("/api/roles/" + team + "/members", { member: user.id })
      .map((g: GenericResponse) => { if (g.status == RESPONSE_STATUS.ERROR) { console.log(g.error) } })
      .toPromise();

  }

  public async removeMember(team: string, user: string): Promise<void> {
    return await this.http.delete<GenericResponse>("/api/roles/" + team + "/members/" + user)
      .map((g: GenericResponse) => { if (g.status == RESPONSE_STATUS.ERROR) { console.log(g.error) } })
      .toPromise();
  }

  public async updateLeader(team: string, user: string, leader: boolean): Promise<void> {
    return await this.http.put("/api/roles/" + team + "/leaders/" + user, { leader: leader })
      .map((g: GenericResponse) => { if (g.status == RESPONSE_STATUS.ERROR) { console.log(g.error) } })
      .toPromise();
  }
}
