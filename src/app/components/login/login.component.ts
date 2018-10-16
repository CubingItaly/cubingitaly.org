import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TitleManagerService } from '../../services/title-manager.service';
import { MetaManagerService } from '../../services/meta-manager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public authSVC: AuthService, private titleSVC: TitleManagerService, private metaSVC: MetaManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Login");
    this.metaSVC.addMeta("robots", "noindex,nofollow");
  }

  ngOnDestroy() {
    this.metaSVC.removeMeta("robots");
  }

  login() {
    this.authSVC.login();
  }

  logout() {
    this.authSVC.logout();
  }

}
