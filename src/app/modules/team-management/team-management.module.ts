import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routes } from './team-management-routing.module';
import { RouterModule } from '@angular/router';
import { TeamsListComponent } from './teams-list/teams-list.component';
import { TeamsService } from './services/teams.service';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule} from '@angular/flex-layout'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { TeamMembersComponent } from './team-members/team-members.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [TeamsListComponent, TeamMembersComponent],
  providers: [
    TeamsService
  ]
})
export class TeamManagementModule { }
