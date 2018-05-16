import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleViewComponent } from './article-view/article-view.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ArticlesRoleGuard } from './services/articles.roleguard.service';
import { ArticleAdminComponent } from './article-admin/article-admin.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list', component: ArticleListComponent
  },
  {
    path: 'admin', canActivate: [ArticlesRoleGuard], component: ArticleAdminComponent, data: { expectedRole: "adminArticles" }
  },
  {
    path: 'new', canActivate: [ArticlesRoleGuard], component: ArticleEditorComponent, data: { action: 0, expectedRole: "publishArticles" }
  },
  {
    path: ':id/edit', canActivate: [ArticlesRoleGuard], component: ArticleEditorComponent, data: { action: 1, expectedRole: "editArticles" }
  },
  {
    path: ':id', canActivate: [ArticlesRoleGuard], component: ArticleViewComponent, data: { expectedRole: "viewArticles" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
