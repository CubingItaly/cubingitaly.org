import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { loadChildren: 'app/modules/team/team.module#TeamModule', path: 'teams' }
];
