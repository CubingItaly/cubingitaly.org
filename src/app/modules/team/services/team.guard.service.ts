import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';

@Injectable()
export class TeamRoleGuard implements CanActivate {
    constructor(private authSVC: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authSVC.isLoggedIn) {
            const requiredRole: string = route.data.requiredRole;
            if (requiredRole == 'admin') {
                if (this.authSVC.authUser.canAdminTeams())
                    return true;
            } else if (requiredRole == 'manager') {
                let teamId: string = route.params.id;
                let team: TeamModel = new TeamModel();
                team.id = teamId;
                if (this.authSVC.authUser.canManageTeam(team))
                    return true;
            }
        }
        this.router.navigate(['permission-denied']);
    }
}