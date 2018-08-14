import { Routes} from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamManagementComponent } from './team-management/team-management.component';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'admin' },
    {
        path: 'admin', component: TeamListComponent
    },
    {   
        path:':id/admin', component: TeamManagementComponent
    }
];
