import { Component, OnInit } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { PageEvent } from '@angular/material';
import { ArticleService } from '../services/article.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-admin',
  templateUrl: './article-admin.component.html',
  styleUrls: ['./article-admin.component.css']
})
export class ArticleAdminComponent implements OnInit {

  articles: ArticleModel[];
  articlesNumber: number = 0;
  articlesPerPage: number = 15;

  page: number;

  displayedColumns: string[] = ["title", "editor", "update", "status", "options"];

  constructor(private articleSVC: ArticleService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.articleSVC.countAllArticles().subscribe((result: { number: number }) => {
      this.articlesNumber = result.number;
      this.page = Number(this.route.snapshot.paramMap.get("page")) || 1;
      if (this.page > this.articlesNumber / this.articlesPerPage || this.page < 1) {
        this.page = 1;
        this.router.navigate(['../' + this.page], { relativeTo: this.route });
      }
      this.getArticles();
    });
  }


  private getArticles() {
    this.articleSVC.getAllArticles(this.articlesPerPage, this.page - 1).subscribe(result => this.articles = result);
  }

  pageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.getArticles();
    this.router.navigate(['../' + this.page], { relativeTo: this.route });
  }

}
