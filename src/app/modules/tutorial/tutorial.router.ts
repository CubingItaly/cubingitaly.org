import { Routes } from '@angular/router';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorialEditorComponent } from './tutorial-editor/tutorial-editor.component';
import { TutorialListComponent } from './tutorial-list/tutorial-list.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'list/1', pathMatch: 'full'
    }, {
        path: 'list', redirectTo: 'list/1', pathMatch: 'full'
    },
    {
        path: 'list/:page', component: TutorialListComponent
    },
    {
        path: ':id/edit', component: TutorialEditorComponent, data: { intent: "edit" }
    },
    {
        path: 'new', component: TutorialEditorComponent, data: { intent: "new" }
    },
    {
        path: ':id', component: TutorialComponent
    },
];
