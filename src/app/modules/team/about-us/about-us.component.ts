import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/team.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { UserModel } from '../../../../../server/models/classes/user.model';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  teams: TeamModel[];
  mapTeamMembers: Map<string, UserModel[]> = new Map<string, UserModel[]>();

  constructor(private teamSVC: TeamService) { }

  ngOnInit() {
    this.teamSVC.getTeamsList().subscribe((teams: TeamModel[]) => {
      teams = teams.filter(t => t.isPublic);
      this.teams = teams;
      this.teams.forEach(team => {
        this.teamSVC.getTeamMembers(team.id).subscribe(members => {
          this.mapTeamMembers[team.id] = members;
        })
      })
    })

  }

  public getUsers(id: string): string {
    let users: UserModel[] = this.mapTeamMembers[id];
    let result = "";
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].isLeaderOf(id)) {
          result = users[i].name + " (Leader), " + result;
        } else {
          result += users[i].name + ", ";
        }
      }
      if (result.endsWith(", "))
        result = result.substr(0, result.length - 2);
    }

    return result;
  }


}
