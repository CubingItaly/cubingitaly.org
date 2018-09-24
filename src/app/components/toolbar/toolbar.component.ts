import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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


  ngOnInit() {
  }

  sideMenuButtonClicked() {
    this.ngModel = !this.ngModel;
    this.ngModelChange.emit(this.ngModel);
  }

  urlClicked(url) {
    window.scrollTo(0,0);
    this.router.navigate([url]);
  }

}
