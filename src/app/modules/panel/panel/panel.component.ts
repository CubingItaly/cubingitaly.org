import { Component, OnInit } from '@angular/core';
import { TitleManagerService } from '../../../services/title-manager.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Pannello utente");
  }

}
