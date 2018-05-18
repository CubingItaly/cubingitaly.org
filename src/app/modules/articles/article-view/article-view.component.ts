import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../../server/models/article.model';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleCategory } from '../../../../../server/models/article.category.model';
import { ArticlesService } from '../services/articles.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.css'],

})
export class ArticleViewComponent implements OnInit {

  article: Article;

  user: CIUser;

  constructor(private authSvc: AuthService, private articleSvc: ArticlesService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    //Get the current user
    this.user = this.authSvc.authUser;
    //Retrieve the artcle id from the URL
    let article_id: string = this.route.snapshot.paramMap.get("id");
    //Get the article
    this.article = await this.articleSvc.getArticle(article_id);
  }

}
