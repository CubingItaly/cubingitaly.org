import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/team.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { TitleManagerService } from '../../../services/title-manager.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  teams: TeamModel[] = [];
  displayedColumns = ['name', 'options'];

  constructor(private teamSVC: TeamService, private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.teamSVC.getTeamsList().subscribe((teams: TeamModel[]) => this.teams = teams);
    this.titleSVC.setTitle("Gestione dei team");
  }

}
