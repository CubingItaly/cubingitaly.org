import { Component, OnInit } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';

@Component({
  selector: 'app-proposed-competitions',
  templateUrl: './proposed-competitions.component.html',
  styleUrls: ['./proposed-competitions.component.css']
})
export class ProposedCompetitionsComponent implements OnInit {

  constructor(private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Competizioni Proposte")
  }

}
