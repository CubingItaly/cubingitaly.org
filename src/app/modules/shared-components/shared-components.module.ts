import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share/share.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ShareButtonsModule
  ],
  declarations: [ShareComponent],
  exports: [ShareComponent]
})
export class SharedComponentsModule { }
