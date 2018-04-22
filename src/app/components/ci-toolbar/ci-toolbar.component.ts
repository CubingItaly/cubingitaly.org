import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { wca_user } from '../../../../server/models/wca_user.model';
import { Deserialize } from 'cerialize';

@Component({
  selector: 'app-ci-toolbar',
  templateUrl: './ci-toolbar.component.html',
  styleUrls: ['./ci-toolbar.component.css']
})
export class CiToolbarComponent implements OnInit {

  constructor(public authSVC: AuthService) {
  }

  ngOnInit() {}

}
