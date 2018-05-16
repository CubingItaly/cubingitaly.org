import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-team-info-editor',
  templateUrl: './team-info-editor.component.html',
  styleUrls: ['./team-info-editor.component.css']
})
export class TeamInfoEditorComponent implements OnInit {

  teamInfoText = "";

  constructor(private teamSVC: TeamsService) { }

  ngOnInit() {
    this.teamInfoText = this.teamSVC.getInfo();
  }

  updateContent() {
    this.teamSVC.setInfo(this.teamInfoText);
    console.log(this.teamInfoText);
  }
}
