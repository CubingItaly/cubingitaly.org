import { Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamManagementComponent } from './team-management/team-management.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamRoleGuard } from './services/team.guard.service';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'admin' },
    {
        path: 'admin', component: TeamListComponent, canActivate: [TeamRoleGuard], data: { requiredRole: ['admin'] }
    },
    {
        path: ':id/admin', component: TeamManagementComponent, canActivate: [TeamRoleGuard], data: { requiredRole: ['manager'] }
    }
];
