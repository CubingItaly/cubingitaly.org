import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutUsComponent } from './modules/team/about-us/about-us.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';


export const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { loadChildren: 'app/modules/team/team.module#TeamModule', path: 'teams' },
    { loadChildren: 'app/modules/article/article.module#ArticleModule', path: 'articles' },
    { path: 'about', component: AboutUsComponent },
    { path: 'permission-denied', component: PermissionDeniedComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: "/not-found" }
]
