import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutUsComponent } from './modules/team/about-us/about-us.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';
import { PanelComponent } from './modules/panel/panel/panel.component';
import { PanelGuardService } from './modules/panel/services/panel.guard';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { ProposedCompetitionsComponent } from './components/proposed-competitions/proposed-competitions.component';

export const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { loadChildren: 'app/modules/team/team.module#TeamModule', path: 'team' },
    { loadChildren: 'app/modules/article/article.module#ArticleModule', path: 'articoli' },
    { loadChildren: 'app/modules/tutorial/tutorial.module#TutorialModule', path: 'tutorial' },
    {path:'competizioni-proposte', component: ProposedCompetitionsComponent},
    { path: 'login', component: LoginComponent },
    { path: 'contatti', component: ContactComponent },
    { path: 'pannello', canActivate: [PanelGuardService], component: PanelComponent },
    { path: 'chi-siamo', component: AboutUsComponent },
    { path: 'permesso-negato', component: PermissionDeniedComponent },
    { path: 'non-trovato', component: NotFoundComponent },
    { path: '**', redirectTo: "/non-trovato" }
]
