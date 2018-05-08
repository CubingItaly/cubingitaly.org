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
import { AuthService } from '../../services/auth.service';
import { TeamRoleGuard } from './services/team.roleguard.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [TeamsListComponent, TeamMembersComponent],
  providers: [
    TeamsService, TeamRoleGuard
  ]
})
export class TeamManagementModule { }
