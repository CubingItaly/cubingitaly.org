import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PanelService } from '../services/panel.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';

@Component({
  selector: 'team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit {

  teams: TeamModel[];

  constructor(public authSVC: AuthService, private panelSVC: PanelService) { }

  ngOnInit() {
    this.panelSVC.getTeams().subscribe(res => this.teams = res.sort((a, b) => {
      if (a.name < b.name)
        return -1;
      else if (b.name < a.name)
        return 1;
      else return 0;
    }));
  }

}
