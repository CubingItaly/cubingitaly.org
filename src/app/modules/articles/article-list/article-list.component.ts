import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../../server/models/article.model';
import { ArticlesService } from '../services/articles.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  articles: Article[];
  constructor(private articleSvc: ArticlesService, private router: Router, private route : ActivatedRoute) { }

  ngOnInit() {
    this.articleSvc.getArticles().then((articles: Article[]) => this.articles = articles);
  }

  goToArticle(id) {
    console.log("im here")
    this.router.navigate(['../' + id], { relativeTo: this.route });
  }
}
