import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleModel } from '../../../../server/models/classes/article.model';
import { ArticleService } from '../../modules/article/services/article.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  articles$: Observable<ArticleModel[]>;

  constructor(private articleSVC: ArticleService) { }

  ngOnInit() {
    this.articles$ = this.articleSVC.getPublicArticles(5, 0, "news");
  }

}
