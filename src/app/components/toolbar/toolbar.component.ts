import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../../server/models/classes/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @ViewChild("sidenav") sidenav: MatSidenav;

  @Input() menuUrls: any[];

  @Input() ngModel: boolean = false;
  @Output() ngModelChange = new EventEmitter<boolean>();

  constructor(public authSVC: AuthService, private router: Router) { }

  user: UserModel;
  subs$: Subscription;

  ngOnInit() {
    this.subs$ = this.authSVC.user.subscribe((u: UserModel) => { this.user = u; });
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }


  sideMenuButtonClicked() {
    this.ngModel = !this.ngModel;
    this.ngModelChange.emit(this.ngModel);
  }
}
