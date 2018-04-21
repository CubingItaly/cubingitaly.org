import { Component, OnInit } from '@angular/core';
import { LoggedInService } from '../../services/logged.service';

@Component({
  selector: 'app-ci-toolbar',
  templateUrl: './ci-toolbar.component.html',
  styleUrls: ['./ci-toolbar.component.css']
})
export class CiToolbarComponent implements OnInit {

  constructor(public loginSvc: LoggedInService) {}

  ngOnInit() {
  }

}
