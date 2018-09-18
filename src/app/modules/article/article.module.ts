import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from './article-list/article-list.component';
import { routes } from './article.router';
import { RouterModule } from '@angular/router';
import { ArticleService } from './services/article.service';
import { ArticleGuardService } from './services/article.guard.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatPaginator, MatPaginatorModule, MatIconModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatTableModule, MatExpansionModule, MatPaginatorIntl } from '@angular/material';
import { ArticleComponent } from './article/article.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArticleAdminComponent } from './article-admin/article-admin.component';
import { ItalianMatPaginator } from './services/article.paginator.it';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HtmlViewerModule } from '../html-viewer/html-viewer.module';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        ShareButtonsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatExpansionModule,
        CKEditorModule,
        HtmlViewerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ArticleListComponent, ArticleComponent, ArticleEditorComponent, ArticleAdminComponent],
    providers: [ArticleService, ArticleGuardService, { provide: MatPaginatorIntl, useClass: ItalianMatPaginator }]
})
export class ArticleModule { }
