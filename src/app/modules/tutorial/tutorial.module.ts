import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorialEditorComponent } from './tutorial-editor/tutorial-editor.component';
import { TutorialListComponent } from './tutorial-list/tutorial-list.component';
import { routes } from './tutorial.router';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatDialogModule, MatListModule, MatPaginatorModule, MatPaginatorIntl, MatExpansionModule } from '@angular/material';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { PageModule } from '../page/page.module';
import { TutorialItalianMatPaginator } from './services/tutorial.paginator.it';
import { EditorQuickActionsComponent } from './editor-quick-actions/editor-quick-actions.component';
import { TutorialAdminComponent } from './tutorial-admin/tutorial-admin.component';
import { TutorialSummaryComponent } from './tutorial-summary/tutorial-summary.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

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
    PageModule,
    MatPaginatorModule,
    SharedComponentsModule,
    MatExpansionModule
  ],
  declarations: [TutorialComponent, TutorialEditorComponent, TutorialListComponent, EditorQuickActionsComponent, TutorialAdminComponent, TutorialSummaryComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: TutorialItalianMatPaginator }]
})
export class TutorialModule { }
