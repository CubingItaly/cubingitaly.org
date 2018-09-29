import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share/share.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { RoleDirective } from './directives/role.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ShareButtonsModule
  ],
  declarations: [ShareComponent, RoleDirective],
  exports: [ShareComponent, RoleDirective]
})
export class SharedComponentsModule { }
