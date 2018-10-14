import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../../../server/models/classes/user.model';

@Injectable({
    providedIn: 'root'
})
export class PanelGuardService implements CanActivate {

    constructor(private authSVC: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot) {
        let user: UserModel = await this.authSVC.user().toPromise();
        if (user.id)
            return true;
        this.router.navigate(['permesso-negato']);
    }
}