import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CITeam } from '../../../../../server/models/ci.team.model';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {

  members: CIUser[];
  team: CITeam;
  teamId: string;
  displayedColumns = ['name', , 'id', 'leader', 'options'];


  usersList: CIUser[];
  auto;
  newMember: CIUser;

  myControl: FormControl = new FormControl();

  constructor(private teamSvc: TeamsService, private authSvc: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.getTeam();
    this.getMembers();

    this.myControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(name => {
        this.teamSvc.getUsersByName(name).then((u: CIUser[]) => this.usersList = u.filter((user: CIUser) => this.members.findIndex((m: CIUser) => m.id == user.id) == -1));
      });
  }

  getTeam() {
    this.teamSvc.getTeam(this.teamId).then((t: CITeam) => this.team = t);
  }

  getMembers() {
    this.teamSvc.getTeamMembers(this.teamId).then((u: CIUser[]) => this.members = u);
  }

  addRole() {
    this.teamSvc.addNewMember(this.team.id, this.newMember).then(() => this.getMembers());
    this.myControl.setValue("");
  }

  removeMember(id) {
    this.teamSvc.removeMember(this.team.id, id).then(() => this.getMembers());
  }

  promoteLeader(id) {
    this.teamSvc.updateLeader(this.team.id, id, true).then(() => this.getMembers());
  }

  demoteLeader(id) {
    this.teamSvc.updateLeader(this.team.id, id, false).then(() => this.getMembers());
  }

}
