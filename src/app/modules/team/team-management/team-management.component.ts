import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamModel } from '../../../../../server/models/classes/team.model';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { TeamService } from '../services/team.service';
import { RoleModel } from '../../../../../server/models/classes/role.model';
import { Deserialize } from 'cerialize';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css']
})
export class TeamManagementComponent implements OnInit {

  teamId: string;
  team: TeamModel;


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



  constructor(private userSVC: UserService, public authSVC: AuthService, private teamSVC: TeamService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.teamSVC.getTeamById(this.teamId).subscribe((team: TeamModel) => this.team = team);
    this.getTeamMembers();
    this.formControl.valueChanges.pipe(debounceTime(400))
      .subscribe(name => {
        this.userSVC.searchUsers(name).subscribe((u: UserModel[]) => this.foundUsers = u.filter((user: UserModel) => this.users.findIndex((m: UserModel) => m.id == user.id) == -1));
      });
  }


  public promoteLeader(user: number) {
    this.teamSVC.addTeamLeader(this.teamId, user).subscribe(() => this.manageTeamUpdate());
  }

  public demoteLeader(user: number) {
    this.teamSVC.demoteTeamLeader(this.teamId, user).subscribe(() => this.manageTeamUpdate());
  }

  public addMember() {
    this.teamSVC.addTeamMember(this.teamId, this.newMember.id).subscribe(() => this.manageTeamUpdate());
    this.formControl.setValue("");
    this.newMember = undefined;
  }

  public removeMember(user: number) {
    this.teamSVC.removeTeamMember(this.teamId, user).subscribe(() => this.manageTeamUpdate());
  }

  private manageTeamUpdate() {
    this.getTeamMembers();
  }

  private getTeamMembers() {
    this.teamSVC.getTeamMembers(this.teamId).subscribe((users: UserModel[]) => this.users = users);
  }

}
