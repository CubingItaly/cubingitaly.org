import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from './article-list/article-list.component';
import { routes } from './article.router';
import { RouterModule } from '@angular/router';
import { ArticleService } from './services/article.service';
import { ArticleGuardService } from './services/article.guard.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatPaginator, MatPaginatorModule, MatIconModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { ArticleComponent } from './article/article.component';
import { SummernoteModule } from '../summernote/summernote.module';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    SummernoteModule,
    ShareButtonsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ArticleListComponent, ArticleComponent, ArticleEditorComponent],
  providers: [ArticleService, ArticleGuardService]
})
export class ArticleModule { }
