import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuUrls = [
    {
      id: "home",
      text: "home",
      url: "/",
      isSelected: true
    },
    {
      id: "about",
      text: "chi siamo",
      url: "/about",
      isSelected: false
    },
    {
      id: "articles",
      text: "articoli",
      url: "/articles",
      isSelected: false
    },
    {
      id: "teams",
      text: "team",
      url: "/teams",
      isSelected: false
    }
  ]

  constructor(private router: Router) {
   
  }
}
