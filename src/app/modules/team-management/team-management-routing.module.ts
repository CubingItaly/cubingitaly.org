import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamsListComponent } from './teams-list/teams-list.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { TeamRoleGuard } from './services/team.roleguard.service';


export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
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
