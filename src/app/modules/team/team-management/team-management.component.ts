import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css']
})
export class TeamManagementComponent implements OnInit {

  teamId: string;
  team: TeamModel;
  users: UserModel[];
  displayedColumns: string[] = ["name", "id", "leader", "options"];
  errorMessage: string;

  constructor(private teamSVC: TeamService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.teamSVC.getTeamById(this.teamId).subscribe((team: TeamModel) => this.team = team);
    this.teamSVC.getTeamMembers(this.teamId).subscribe((users: UserModel[]) => this.users = users);
  }

}
