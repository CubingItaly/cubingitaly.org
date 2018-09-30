import { Component, OnInit } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { ArticleService } from '../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articlesPerPage: number = 7;
  articlesNumber: number = 0;
  page: number;
  category: string = "";

  articles$: Observable<ArticleModel[]>;

  constructor(private router: Router, private articleSVC: ArticleService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data.category) {
      this.category = this.route.snapshot.data.category;
    }
    this.articleSVC.countPublicArticles().subscribe((result: { "number": number }) => {
      this.articlesNumber = result.number;
      this.page = Number(this.route.snapshot.paramMap.get("page")) || 1;
      if (this.page > this.articlesNumber / this.articlesPerPage || this.page < 1) {
        this.page = 1;
        this.router.navigate(['../' + this.page], { relativeTo: this.route });
      }
      this.getArticles();
    });
  }

  async pageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.getArticles();
    this.router.navigate(['../' + this.page], { relativeTo: this.route });
  }

  private getArticles() {
    this.articles$ = this.articleSVC.getPublicArticles(this.articlesPerPage, this.page - 1, null);
  }
}


