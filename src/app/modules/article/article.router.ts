import { Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article/article.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ArticleAdminComponent } from './article-admin/article-admin.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'list/1', pathMatch: 'full'
    },
    {
        path: 'list', redirectTo: 'list/1', pathMatch: 'full'
    },
    {
        path: 'list/:page', component: ArticleListComponent
    },
    {
        path: 'admin', redirectTo: 'admin/1', pathMatch: 'full'
    },
    {
        path: 'admin/:page', component: ArticleAdminComponent
    },
    {
        path: 'new', component: ArticleEditorComponent, data: { intent: "new" }
    },
    {
        path: ':id/edit', component: ArticleEditorComponent, data: { intent: "edit" }
    },
    {
        path: ':id', component: ArticleComponent
    }
];
