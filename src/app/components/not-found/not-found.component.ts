import { Component, OnInit } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Pagina non trovata");
  }

}
