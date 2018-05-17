import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../../server/models/article.model';
import { ArticlesService } from '../services/articles.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-article-admin',
  templateUrl: './article-admin.component.html',
  styleUrls: ['./article-admin.component.css']
})
export class ArticleAdminComponent implements OnInit {

  //Columns shown in the table
  displayedColumns = ['title', 'author', 'update', 'status', 'options'];

  articles: Article[];

  page: number;
  maxPage: number;
  articlePerPage: number = 15;
  articlesNumber: number

  constructor(private articleSvc: ArticlesService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    //get the current page number
    this.page = +this.route.snapshot.paramMap.get("page") || 1;
    //count all the articles
    this.articlesNumber = await this.articleSvc.getAdminAllArticleNumber();
    //count max page number
    this.maxPage = this.articlesNumber % this.articlePerPage + 1;

    //if current page is out of the page range, set it to 1 and update the URL
    if (this.page > this.maxPage || this.page < 1) {
      this.page = 1;
      this.router.navigate(['../1'], { relativeTo: this.route });
    }

    //Get the articles of the current page
    this.articles = await this.articleSvc.getAdminAllArticles(this.page);
  }

  /**
   * Method called when a PageEvent is fired by the paginator
   * 
   * @param {PageEvent} event 
   * @memberof ArticleAdminComponent
   */
  async pageChange(event: PageEvent) {
    //Update the currente page, +1 is because of the different indexing
    this.page = event.pageIndex + 1;
    //Get the articles of the current page
    this.articles = await this.articleSvc.getAdminAllArticles(this.page);
    //Update the URL
    this.router.navigate(['../' + (this.page)], { relativeTo: this.route });
  }
}
