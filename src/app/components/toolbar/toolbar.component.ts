import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../../server/models/classes/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @ViewChild("sidenav") sidenav: MatSidenav;

  @Input() menuUrls: any[];

  @Input() ngModel: boolean = false;
  @Output() ngModelChange = new EventEmitter<boolean>();

  constructor(public authSVC: AuthService, private router: Router) { }

  user$: Observable<UserModel>;

  ngOnInit() {
    this.user$ = this.authSVC.user();
  }

  sideMenuButtonClicked() {
    this.ngModel = !this.ngModel;
    this.ngModelChange.emit(this.ngModel);
  }
}
