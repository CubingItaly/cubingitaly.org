import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { loadChildren: 'app/modules/teams/teams.module#TeamsModule', path: 'teams' },
    { loadChildren: 'app/modules/articles/articles.module#ArticlesModule', path: 'articles' },
    { loadChildren: 'app/modules/error/error.module#ErrorModule', path: 'error' },
    { path: '**', redirectTo: 'error' }
];
