import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authSVC: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authSVC.login();
  }

  logout() {
    this.authSVC.logout();
  }

}
