import { Component, OnInit } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { ArticleService } from '../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articlesPerPage: number = 5;
  articlesNumber: number = 0;
  page: number;
  user: UserModel;


  articles: ArticleModel[];

  constructor(public authSVC: AuthService, private router: Router, private articleSVC: ArticleService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authSVC.authUser;
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
    this.articleSVC.getPublicArticles(this.articlesPerPage, this.page - 1, null).subscribe(result => this.articles = result);
  }
}


