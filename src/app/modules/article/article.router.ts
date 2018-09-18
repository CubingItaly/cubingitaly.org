import { Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article/article.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ArticleAdminComponent } from './article-admin/article-admin.component';
import { ArticleGuardService } from './services/article.guard.service';

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
        path: 'admin', canActivate: [ArticleGuardService], redirectTo: 'admin/1', pathMatch: 'full', data: { requiredRole: "admin" }
    },
    {
        path: 'admin/:page', canActivate: [ArticleGuardService], component: ArticleAdminComponent, data: { requiredRole: "admin" }
    },
    {
        path: 'new', canActivate: [ArticleGuardService], component: ArticleEditorComponent, data: { intent: "new", requiredRole: "admin" }
    },
    {
        path: ':id/edit', canActivate: [ArticleGuardService], component: ArticleEditorComponent, data: { intent: "edit", requiredRole: "editor" }
    },
    {
        path: ':id', component: ArticleComponent
    }
];
