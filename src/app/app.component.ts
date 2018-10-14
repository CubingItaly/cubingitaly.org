import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { UserModel } from '../../server/models/classes/user.model';
import { TitleManagerService } from './services/title-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  menuUrls: { id: string, text: string, url: string, isSelected: boolean, icon: string, login: boolean }[] = [

    {
      id: "home", text: "home", url: "/", isSelected: false, icon: "home", login: false
    },
    {
      id: "about", text: "chi siamo", url: "/chi-siamo", isSelected: false, icon: "info-circle", login: false
    },
    {
      id: "articles", text: "articoli", url: "/articoli", isSelected: false, icon: "newspaper-o", login: false
    },
    {
      id: "tutorial", text: "tutorial", url: "/tutorial", isSelected: false, icon: "book", login: false
    },
    {
      id: "contact", text: "contatti", url: "/contatti", isSelected: false, icon: "envelope", login: false
    },
    {
      id: "panel", text: "pannello", url: "/pannello", isSelected: false, icon: "lock", login: true
    }
  ];

  isSidebarOpened: boolean = false;
  @ViewChild("sidenav") sidenav: MatSidenav;

  user$: Observable<UserModel>;

  constructor(public authSVC: AuthService, private router: Router, private titleSVC: TitleManagerService) { }
  ngOnInit() {
    this.user$ = this.authSVC.user();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let slashIndex = event.url.indexOf("/", 1);
        let length = event.url.length;
        if (slashIndex > 0) {
          length = slashIndex;
        }
        let section = event.url.substr(0, length);
        this.menuUrls.forEach((url) => url.isSelected = url.url === section);
      }
    })

  }
}
