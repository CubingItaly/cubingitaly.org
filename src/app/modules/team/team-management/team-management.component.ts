import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { TeamService } from '../services/team.service';
import { RoleModel } from '../../../../../server/models/classes/role.model';
import { Deserialize } from 'cerialize';
import { FormControl } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { TitleManagerService } from '../../../services/title-manager.service';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css']
})
export class TeamManagementComponent implements OnInit {

  teamId: string;
  team$: Observable<TeamModel>;


  /**
   * Table attributes
   */
  users: UserModel[];
  displayedColumns: string[] = ["name", "id", "leader", "options"];

  /**
   * New member form attributes
   */
  foundUsers: UserModel[];
  auto;
  newMember: UserModel;

  formControl: FormControl = new FormControl();



  constructor(private dialog: MatDialog, private userSVC: UserService, private teamSVC: TeamService, private route: ActivatedRoute, private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.team$ = this.teamSVC.getTeamById(this.teamId);
    this.getTeamMembers();
    this.formControl.valueChanges.pipe(debounceTime(400))
      .subscribe(name => {
        this.userSVC.searchUsers(name).subscribe((u: UserModel[]) => this.foundUsers = u.filter((user: UserModel) => this.users.findIndex((m: UserModel) => m.id == user.id) == -1));
      });
    this.titleSVC.setTitle("Gestione team");
  }


  public promoteLeader(id: number) {
    let user = this.users.find(u => u.id === id);
    let obs = this.createDialog("Sei sicuro di voler promuovere " + user.name + " a Leader del team?");
    obs.subscribe((result: boolean) => {
      if (result)
        this.teamSVC.addTeamLeader(this.teamId, id).subscribe(() => this.manageTeamUpdate());
    });
  }

  public demoteLeader(id: number) {
    let user = this.users.find(u => u.id === id);
    let obs = this.createDialog("Sei sicuro di voler rimuovere " + user.name + " da Leader del team?");
    obs.subscribe((result: boolean) => {
      if (result)
        this.teamSVC.demoteTeamLeader(this.teamId, id).subscribe(() => this.manageTeamUpdate());
    });
  }

  public addMember() {
    if (this.newMember !== undefined) {
      let obs = this.createDialog("Sei sicuro di voler aggiungere " + this.newMember.name + " ai membri del team?");
      obs.subscribe((result: boolean) => {
        this.teamSVC.addTeamMember(this.teamId, this.newMember.id).subscribe(() => this.manageTeamUpdate());
        this.formControl.setValue("");
        this.newMember = undefined;
      });
    }
  }

  public removeMember(id: number) {
    let user = this.users.find(u => u.id === id);
    let obs = this.createDialog("Sei sicuro di voler rimuovere " + user.name + " dal team?");
    obs.subscribe((result: boolean) => {
      if (result)
        this.teamSVC.removeTeamMember(this.teamId, id).subscribe(() => this.manageTeamUpdate());
    });
  }

  private manageTeamUpdate() {
    this.getTeamMembers();
  }

  private getTeamMembers() {
    this.teamSVC.getTeamMembers(this.teamId).subscribe((users: UserModel[]) => this.users = users);
  }



  private createDialog(message: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '200px',
      data: message
    });

    return dialogRef.afterClosed();
  }
}
