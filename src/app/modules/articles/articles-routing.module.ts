import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleViewComponent } from './article-view/article-view.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ArticlesRoleGuard } from './services/articles.roleguard.service';
import { ArticleAdminComponent } from './article-admin/article-admin.component';

const routes: Routes = [
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
    path: 'admin/:page', canActivate: [ArticlesRoleGuard], component: ArticleAdminComponent, data: { expectedRole: "adminArticles" }
  },
  {
    path: 'new', canActivate: [ArticlesRoleGuard], component: ArticleEditorComponent, data: { action: 0, expectedRole: "publishArticles" }
  },
  {
    path: ':id', canActivate: [ArticlesRoleGuard], component: ArticleViewComponent, data: { expectedRole: "viewArticles" }
  },
  {
    path: ':id/edit', canActivate: [ArticlesRoleGuard], component: ArticleEditorComponent, data: { action: 1, expectedRole: "editArticles" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
