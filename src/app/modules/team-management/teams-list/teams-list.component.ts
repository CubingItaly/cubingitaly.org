import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { CITeam } from '../../../../../server/models/ci.team.model';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.css']
})
export class TeamsListComponent implements OnInit {

  teams: CITeam[];
  displayedColumns = ['name', 'options'];

  constructor(public teamsSvc: TeamsService) { }

  ngOnInit() {
    this.teamsSvc.getTeams().then(t => {
      this.teams = t;
    });
  }

}

