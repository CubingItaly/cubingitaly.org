import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummernoteComponent } from './summernote/summernote.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SummernoteViewerComponent } from './summernote-viewer/summernote-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SummernoteComponent, SafeHtmlPipe, SummernoteViewerComponent],
  exports: [SummernoteComponent, SummernoteViewerComponent]
})
export class SummernoteModule { }
