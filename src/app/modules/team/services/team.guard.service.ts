import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { TeamModel } from '../../../../../server/models/classes/team.model';

@Injectable()
export class TeamRoleGuard implements CanActivate {
    constructor(private authSVC: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authSVC.isLoggedIn) {
            const requiredRole: string = route.data.requiredRole;
            let user: UserModel = this.authSVC.authUser;
            if (requiredRole == 'admin') {
                if (user.canAdminTeams())
                    return true;
            } else if (requiredRole == 'manager') {
                let teamId: string = route.params.id;
                let team: TeamModel = new TeamModel();
                team.id = teamId;
                console.log("we");
                if (user.canManageTeam(team))
                    return true;
            }
        }
        console.log("we here");
        this.router.navigate(['permission-denied']);
    }
}