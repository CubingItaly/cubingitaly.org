import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { PageViewerComponent } from './page-viewer/page-viewer.component';
import { HtmlViewerModule } from '../html-viewer/html-viewer.module';
import { PageComponent } from './page/page.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HtmlViewerModule,
    CKEditorModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [PageEditorComponent, PageViewerComponent, PageComponent],
  exports: [PageViewerComponent, PageComponent]
})
export class PageModule { }
