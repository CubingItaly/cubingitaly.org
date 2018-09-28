import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'article-panel',
  templateUrl: './article-panel.component.html',
  styleUrls: ['./article-panel.component.css']
})
export class ArticlePanelComponent implements OnInit {

  constructor(public authSVC: AuthService) { }

  ngOnInit() {
  }

}
