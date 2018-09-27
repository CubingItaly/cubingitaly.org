import { Routes } from '@angular/router';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorialEditorComponent } from './tutorial-editor/tutorial-editor.component';
import { TutorialListComponent } from './tutorial-list/tutorial-list.component';
import { TutorialAdminComponent } from './tutorial-admin/tutorial-admin.component';
import { TutorialGuardService } from './services/tutorial.guard.service';

export const routes: Routes = [
    {
        path: '', redirectTo: 'list', pathMatch: 'full'
    },
    {
        path: 'list', component: TutorialListComponent
    },
    {
        path: 'admin', canActivate: [TutorialGuardService], component: TutorialAdminComponent, data: { requiredRole: "view" }
    },
    {
        path: ':id/edit', canActivate: [TutorialGuardService], component: TutorialEditorComponent, data: { intent: "edit", requiredRole: "edit" }
    },
    {
        path: 'new', canActivate: [TutorialGuardService], component: TutorialEditorComponent, data: { intent: "new", requiredRole: "create" }
    },
    {
        path: ':id', redirectTo: ':id/1', pathMatch: 'full'
    },
    {
        path: ':id/:page', component: TutorialComponent
    },
];
