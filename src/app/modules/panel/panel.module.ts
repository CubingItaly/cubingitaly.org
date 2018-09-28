import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TeamPanelComponent } from './team-panel/team-panel.component';
import { MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ArticlePanelComponent } from './article-panel/article-panel.component';
import { TutorialPanelComponent } from './tutorial-panel/tutorial-panel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatListModule
  ],
  declarations: [PanelComponent, TeamPanelComponent, ArticlePanelComponent, TutorialPanelComponent]
})
export class PanelModule { }
