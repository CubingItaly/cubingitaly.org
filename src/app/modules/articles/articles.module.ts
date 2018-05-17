import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleViewComponent } from './article-view/article-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { MatChipsModule } from '@angular/material/chips';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { MatInputModule } from '@angular/material/input';
import { ArticlesService } from './services/articles.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ArticlesRoleGuard } from './services/articles.roleguard.service';
import { ArticleAdminComponent } from './article-admin/article-admin.component';
import { ArticlePanelComponent } from './article-panel/article-panel.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  imports:
    [
      FormsModule,
      CommonModule,
      ArticlesRoutingModule,
      FlexLayoutModule,
      MatCardModule,
      MatDividerModule,
      MatButtonModule,
      ShareButtonsModule,
      MatInputModule,
      MatChipsModule,
      MatIconModule,
      MatToolbarModule,
      MatAutocompleteModule,
      ReactiveFormsModule,
      MatTableModule,
      MatPaginatorModule
    ],
  declarations:
    [
      ArticleViewComponent,
      ArticleListComponent,
      ArticleEditorComponent,
      ArticleAdminComponent,
      ArticlePanelComponent
    ],
  providers:
    [
      ArticlesService,
      ArticlesRoleGuard
    ]
})
export class ArticlesModule { }
