import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CITeam } from '../../../../../server/models/ci.team.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {

  users: CIUser[];
  team: CITeam;
  teamId: string;
  displayedColumns = ['name', ,'id', 'leader', 'options'];

  constructor(private teamSvc: TeamsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id');
    console.log(this.teamId);
    this.teamSvc.getTeam(this.teamId).then((t: CITeam) => this.team = t);
    this.teamSvc.getTeamMembers(this.teamId).then((u: CIUser[]) => {
      console.log(u);
      this.users = u;
    });

  }

}
