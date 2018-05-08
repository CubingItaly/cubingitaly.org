import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { CITeam } from '../../../../../server/models/ci.team.model';

@Injectable()
export class TeamRoleGuard implements CanActivate {
    constructor(private authSvc: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("req");
        if (this.authSvc.isLoggedIn) {
            console.log("is logged");
            const requiredRole: string = route.data.expectedRole;
            let user: CIUser = this.authSvc.authUser;
            if (requiredRole == 'adminTeams') {
                return user.canAdminTeams();
            } else if (requiredRole == 'manageTeam') {
                let teamId: string = route.paramMap.get('id');
                let team: CITeam = new CITeam();
                team.id = teamId;
                return user.canAdminTeams() || user.canManageTeam(team);
            }
        }
        this.router.navigate(['permission-denied']);
    }
}