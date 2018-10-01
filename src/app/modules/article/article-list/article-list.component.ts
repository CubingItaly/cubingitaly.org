import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { TitleManagerService } from '../../../services/title-manager.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  constructor(private articleSVC: ArticleService, private router: Router
    , private route: ActivatedRoute, private titleSVC: TitleManagerService) { }

  page: number;
  category: string;
  articlesNumber: number;
  articlesPerPage: number = 7;

  ngOnInit() {
    this.titleSVC.setTitle("Articoli");
    this.page = Number(this.route.snapshot.paramMap.get("page"));
    if (isNaN(this.page) || this.page < 1) {
      this.page = 1;
    }
    this.category = this.route.snapshot.paramMap.get("category");
    this.updateArticlesCount();

    //we need this for navigate back
    this.router.events.subscribe((event => {
      if (event instanceof NavigationEnd) {
        if (this.category !== this.route.snapshot.paramMap.get("category")) {
          this.category = this.route.snapshot.paramMap.get("category");
          this.page = 1;
          this.updateArticlesCount();
        } else {
          this.page = Number(this.route.snapshot.paramMap.get("page"));
          if (isNaN(this.page) || this.page < 1) {
            this.page = 1;
          }
        }
      }
    }));
  }

  pageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.router.navigate(['../' + (event.pageIndex + 1)], { relativeTo: this.route });
  }

  categoryChange(category) {
    this.router.navigateByUrl('/articles/categories/' + category + '/1');
    this.updateArticlesCount();
  }

  updateArticlesCount() {
    this.articleSVC.countPublicArticles(this.category).subscribe(count => {
      this.articlesNumber = count;
      let maxPage = Math.trunc(count / this.articlesPerPage) + 1;
      if (this.page > maxPage) {
        this.page = maxPage;
      }
    });
  }

}





