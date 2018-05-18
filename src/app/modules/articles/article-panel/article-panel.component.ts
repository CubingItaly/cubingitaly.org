import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ArticlesService } from '../services/articles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-panel',
  templateUrl: './article-panel.component.html',
  styleUrls: ['./article-panel.component.css']
})
export class ArticlePanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
