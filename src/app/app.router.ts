import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { loadChildren: 'app/modules/panel/panel.module#PanelModule', path: 'panel'  },
    { loadChildren: 'app/modules/teams/teams.module#TeamsModule', path: 'teams'  },
    { loadChildren: 'app/modules/articles/articles.module#ArticlesModule', path: 'articles'}
    //{ path: 'permission-denied', component: ''}
];
