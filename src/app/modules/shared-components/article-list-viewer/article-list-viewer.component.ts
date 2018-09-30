import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../article/services/article.service';
import { Observable } from 'rxjs';
import { ArticleModel } from '../../../../../server/models/classes/article.model';

@Component({
  selector: 'article-list-viewer',
  templateUrl: './article-list-viewer.component.html',
  styleUrls: ['./article-list-viewer.component.css']
})
export class ArticleListViewerComponent implements OnInit {

  @Input() category: string;
  @Input() page: number = 0;
  @Input() take: number = 7;

  articles$: Observable<ArticleModel[]>;

  constructor(private articleSVC: ArticleService) { }

  ngOnInit() {
    this.articles$ = this.articleSVC.getPublicArticles(this.take, this.page, this.category);
  }

}
