import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorialEditorComponent } from './tutorial-editor/tutorial-editor.component';
import { TutorialListComponent } from './tutorial-list/tutorial-list.component';
import { routes } from './tutorial.router';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatDialogModule, MatListModule } from '@angular/material';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { PageModule } from '../page/page.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    CKEditorModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatListModule,
    PageModule
  ],
  declarations: [TutorialComponent, TutorialEditorComponent, TutorialListComponent]
})
export class TutorialModule { }
