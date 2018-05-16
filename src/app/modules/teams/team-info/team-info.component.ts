import { Component, OnInit } from '@angular/core';
import { CITeam } from '../../../../../server/models/ci.team.model';
import { TeamsService } from '../services/teams.service';
import { CIUser } from '../../../../../server/models/ci.user.model';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {

  teamInfoText;
  teams: CITeam[];
  mapTeamMembers: Map<string,CIUser[]> = new Map<string,CIUser[]>();
  constructor(private teamSVC: TeamsService) { }

  ngOnInit() {
    this.teamInfoText = this.teamSVC.getInfo();
    this.teamSVC.getTeams().then(teams => {
      this.teams = teams;
      this.teams.forEach(team => {
        this.teamSVC.getTeamMembers(team.id).then((members) => {
          this.mapTeamMembers[team.id] = members;
        });
      });
    });
  }

}
