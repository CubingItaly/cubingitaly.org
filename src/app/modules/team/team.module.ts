import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamService } from './services/team.service';
import { routes } from './team.router';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamManagementComponent } from './team-management/team-management.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamRoleGuard } from './services/team.guard.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageModule } from '../page/page.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatTableModule,
    FlexLayoutModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    PageModule,
    SharedComponentsModule
  ],
  declarations: [TeamListComponent, TeamManagementComponent, AboutUsComponent],
  providers: [TeamService, TeamRoleGuard]
})
export class TeamModule { }
