import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TitleManagerService } from '../../services/title-manager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authSVC: AuthService, private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Login");
  }

  login() {
    this.authSVC.login();
  }

  logout() {
    this.authSVC.logout();
  }

}
