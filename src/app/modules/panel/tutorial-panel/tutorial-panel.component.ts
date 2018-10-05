import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'tutorial-panel',
  templateUrl: './tutorial-panel.component.html',
  styleUrls: ['./tutorial-panel.component.css']
})
export class TutorialPanelComponent implements OnInit {

  constructor(public authSVC: AuthService) { }

  ngOnInit() {
  }

}
