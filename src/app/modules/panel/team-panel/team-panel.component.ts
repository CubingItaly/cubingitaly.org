import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PanelService } from '../services/panel.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit {

  teams$: Observable<TeamModel[]>;

  constructor(private panelSVC: PanelService) { }

  ngOnInit() {
    this.teams$ = this.panelSVC.getTeams();
  }

}
