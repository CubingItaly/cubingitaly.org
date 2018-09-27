import { Routes } from '@angular/router';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorialEditorComponent } from './tutorial-editor/tutorial-editor.component';
import { TutorialListComponent } from './tutorial-list/tutorial-list.component';
import { TutorialAdminComponent } from './tutorial-admin/tutorial-admin.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'list', pathMatch: 'full'
    },
    {
        path: 'list', component: TutorialListComponent
    },
    {
        path: 'admin', component: TutorialAdminComponent
    },
    {
        path: ':id/edit', component: TutorialEditorComponent, data: { intent: "edit" }
    },
    {
        path: 'new', component: TutorialEditorComponent, data: { intent: "new" }
    },
    {
        path: ':id', redirectTo: ':id/1', pathMatch: 'full'
    },
    {
        path: ':id/:page', component: TutorialComponent
    },
];
