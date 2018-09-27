import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ArticleService } from './article.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleGuardService implements CanActivate {

  constructor(private router: Router, private authSVC: AuthService, private articleSVC: ArticleService) { }

  async canActivate(route: ActivatedRouteSnapshot) {
    let role: string = route.data.requiredRole;
    if (this.authSVC.isLoggedIn) {

      if (role === "admin") {
        if (this.authSVC.authUser.canAdminArticles()) {
          return true;
        } else {
          this.router.navigate(['permission-denied']);
        }
      } else if (role === "editor") {
        if (this.authSVC.authUser.canEditArticles()) {
          return true;
        } else {
          this.router.navigate(['permission-denied']);
        }
      }
    }

    this.router.navigate(['permission-denied']);
  }
}
