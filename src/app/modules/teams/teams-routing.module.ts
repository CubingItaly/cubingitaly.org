import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamsListComponent } from './teams-list/teams-list.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { TeamRoleGuard } from './services/team.roleguard.service';
import { TeamInfoEditorComponent } from './team-info-editor/team-info-editor.component';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'info' },
  {
    path: 'info', component: TeamInfoComponent
  },
  {
    path: 'info/edit', component: TeamInfoEditorComponent
  },
  {
    path: 'list', canActivate: [TeamRoleGuard], component: TeamsListComponent, data: {
      expectedRole: ['adminTeams']
    }
  },
  {
    path: ':id/members', canActivate: [TeamRoleGuard], component: TeamMembersComponent, data: {
      expectedRole: ['manageTeam']
    }
  }
];
