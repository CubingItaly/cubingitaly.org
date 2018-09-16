import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  menuUrls: { id: string, text: string, url: string, isSelected: boolean, icon: string }[] = [

    {
      id: "home", text: "home", url: "/", isSelected: false, icon: "home"
    },
    {
      id: "about", text: "chi siamo", url: "/about", isSelected: false, icon: "info-circle"
    },
    {
      id: "articles", text: "articoli", url: "/articles", isSelected: false, icon: "book"
    },
    {
      id: "teams", text: "team", url: "/teams", isSelected: false, icon: "users"
    }
  ];

  isSidebarOpened: boolean = false;
  @ViewChild("sidenav") sidenav: MatSidenav;

  constructor(public authSVC: AuthService, private router: Router) { }
  ngOnInit() {
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

  private setMenu() {

  }


  urlClicked(url) {
    this.router.navigate([url]);
    this.sidenav.close();
  }

}
