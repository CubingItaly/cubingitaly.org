import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/team.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  teams: TeamModel[] = [];
  displayedColumns = ['name', 'options'];

  constructor(private teamSVC: TeamService) { }

  ngOnInit() {
    this.teamSVC.getTeamsList().subscribe((teams: TeamModel[]) => this.teams = teams);
  }

}
