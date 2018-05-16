import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routes } from './panel-routing.module';
import { RouterModule } from '@angular/router';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PanelComponent]
})
export class PanelModule { }
