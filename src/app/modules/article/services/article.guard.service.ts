import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { ArticleService } from './article.service';
import { ArticleModel } from '../../../../../server/models/classes/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleGuardService implements CanActivate {

  constructor(private router: Router, private authSVC: AuthService, private articleSVC: ArticleService) { }

  async canActivate(route: ActivatedRouteSnapshot) {
    let role: string = route.data.requiredRole;
    if (this.authSVC.isLoggedIn) {
      let user: UserModel = this.authSVC.authUser;
      if (role === "admin") {
        if (user.canAdminArticles()) {
          return true;
        } else {
          this.router.navigate(['permission-denied']);
        }
      } else if (role === "editor") {
        if (user.canEditArticles()) {
          return true;
        } else {
          this.router.navigate(['permission-denied']);
        }
      }
    }

    this.router.navigate(['permission-denied']);
  }
}
