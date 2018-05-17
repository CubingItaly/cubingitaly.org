import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../../server/models/article.model';
import { ArticlesService } from '../services/articles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  articles: Article[];

  user: CIUser;

  page: number;
  maxPage: number;
  articlesNumber: number;
  articlePerPage: number = 7;

  constructor(private authSvc: AuthService, private articleSvc: ArticlesService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    //get the current user
    this.user = this.authSvc.authUser;
    //get the current page number
    this.page = +this.route.snapshot.paramMap.get("page") || 1;
    //count all the articles
    this.articlesNumber = await this.articleSvc.getPublicAllArticleNumber();
    //count max page number
    this.maxPage = this.articlesNumber % this.articlePerPage + 1;

    //if current page is out of the page range, set it to 1 and update the URL
    if (this.page > this.maxPage || this.page < 1) {
      this.page = 1;
      this.router.navigate(['../1'], { relativeTo: this.route });
    }

    //Get the articles of the current page
    this.articles = await this.articleSvc.getPublicArticles(this.page);
  }

  goToArticle(id) {
    this.router.navigate(['../../' + id], { relativeTo: this.route });
  }

  /**
   * Method called when a PageEvent is fired by the paginator
   * 
   * @param {PageEvent} event 
   * @memberof ArticleListComponent
   */
  async pageChange(event: PageEvent) {
    //Update the currente page, +1 is because of the different indexing
    this.page = event.pageIndex + 1;
    //Get the articles of the current page
    this.articles = await this.articleSvc.getPublicArticles(this.page);
    //Update the URL
    this.router.navigate(['../' + (this.page)], { relativeTo: this.route });
  }
}
