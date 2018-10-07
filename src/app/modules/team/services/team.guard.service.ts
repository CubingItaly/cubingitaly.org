import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { UserModel } from '../../../../../server/models/classes/user.model';

@Injectable()
export class TeamRoleGuard implements CanActivate {
    constructor(private authSVC: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let user: UserModel = await this.authSVC.user().toPromise();
        if (user.id) {
            const requiredRole: string = route.data.requiredRole;
            if (requiredRole == 'admin') {
                if (user.canAdminTeams())
                    return true;
            } else if (requiredRole == 'manager') {
                let teamId: string = route.params.id;
                let team: TeamModel = new TeamModel();
                team.id = teamId;
                if (user.canManageTeam(team))
                    return true;
            }
        }
        this.router.navigate(['permission-denied']);
    }
}