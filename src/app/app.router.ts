import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutUsComponent } from './modules/team/about-us/about-us.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';
import { PanelComponent } from './modules/panel/panel/panel.component';
import { PanelGuardService } from './modules/panel/services/panel.guard';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { loadChildren: 'app/modules/team/team.module#TeamModule', path: 'teams' },
    { loadChildren: 'app/modules/article/article.module#ArticleModule', path: 'articles' },
    { loadChildren: 'app/modules/tutorial/tutorial.module#TutorialModule', path: 'tutorial' },
    { path: 'contact', component: ContactComponent },
    { path: 'panel', canActivate: [PanelGuardService], component: PanelComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'permission-denied', component: PermissionDeniedComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: "/not-found" }
]
