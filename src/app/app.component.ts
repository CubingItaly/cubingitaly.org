import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  constructor(public authSVC: AuthService, private router: Router) { }


  @ViewChild("sidenav") sidenav: MatSidenav;
  isSidebarOpened: boolean = false;

  ngOnInit() {

  }

  menuUrls = [
    {
      text: "home",
      url: "/"
    },
    {
      text: "team",
      url: "/teams"
    }
  ]

  urlClicked(url) {
    this.router.navigate([url]);
  }

}
