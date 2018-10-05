import { Component, OnInit } from '@angular/core';
import { WCAService, CompWidgetModel } from '../../services/wca.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'upcoming-competitions',
  templateUrl: './upcoming-competitions.component.html',
  styleUrls: ['./upcoming-competitions.component.css']
})
export class UpcomingCompetitionsComponent implements OnInit {

  comp$: Observable<CompWidgetModel[]>;

  constructor(private wcaSVC: WCAService) { }


  competitions: {
    name: string,
    address: string,
    month: string;
    day: number,
    website: string
  }[] = [
      {
        name: "Sicily Open 2018",
        address: "Borghetto Europa Piazza Europa, livello -195127 Catania(CT)",
        month: "OTT",
        day: 6,
        website: "string"
      },
      {
        name: "Italian Championship 2018",
        address: "Hotel Midas, Via Aurelia 22 - Roma",
        month: "NOV",
        day: 2,
        website: "string"
      },
      {
        name: "Big Cubing Italy 2018",
        address: "Politecnico di Milano, via Ampere 2 - Milano",
        month: "DIC",
        day: 11,
        website: "string"
      }

    ]


  ngOnInit() {
    this.comp$ = this.wcaSVC.fetchComp();
  }

}
