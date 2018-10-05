import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlViewerComponent } from './html-viewer/html-viewer.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HtmlViewerComponent, SafeHtmlPipe],
  exports: [HtmlViewerComponent]
})
export class HtmlViewerModule { }
