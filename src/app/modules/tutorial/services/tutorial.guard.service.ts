import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialGuardService implements CanActivate {

  constructor(private authSVC: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {

    let requiredRole: string = route.data.requiredRole;
    switch (requiredRole) {
      case "edit":
        if (this.authSVC.isLoggedIn && this.authSVC.authUser.canEditPages())
          return true;
        this.router.navigate(['permission-denied']);
        break;
      case "view":
        if (this.authSVC.isLoggedIn && this.authSVC.authUser.canViewPrivatePages())
          return true;
        this.router.navigate(['permission-denied']);
        break;
      case "create":
        if (this.authSVC.isLoggedIn && this.authSVC.authUser.canCreateTutorials())
          return true;
        this.router.navigate(['permission-denied']);
        break;
    }
    return true;
  }
}
