import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../../server/models/article.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ArticlesService } from '../services/articles.service';
import { ArticleCategory } from '../../../../../server/models/article.category.model';
import { AuthService } from '../../../services/auth.service';
import { CIUser } from '../../../../../server/models/ci.user.model';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.css']
})
export class ArticleEditorComponent implements OnInit {

  article: Article = new Article();
  isNew: boolean;
  isPublic: boolean;
  articleId: string;
  categories: ArticleCategory[];
  user: CIUser;
  constructor(private authSvc: AuthService, private route: ActivatedRoute, private router: Router, private articleSvc: ArticlesService) { }

  ngOnInit() {
    this.user = this.authSvc.authUser;
    let action: number = this.route.snapshot.data.action;
    if (action == 0) {
      this.isNew = true;
      this.isPublic = false;
    } else {
      this.articleId = this.route.snapshot.paramMap.get('id');
      this.articleSvc.getCategories().then(c => this.categories = c);
      this.articleSvc.getArticle(this.articleId).then((article: Article) => {
        this.article = article;
        this.isPublic = this.article.isPublic;
      });
      this.isNew = false;
    }
  }

  createArticle() {
    this.articleSvc.createArticle(this.article).then((article: Article) => {
      let redirect_url: string = "/articles/" + article.id + "/edit";
      this.router.navigate([redirect_url]);
    });
  }

  updateArticle() {
    this.articleSvc.updateArticle(this.article).then((article: Article) => {
      this.article = article;
      this.isPublic = this.article.isPublic;
    });
  }

  deleteArticle() {
    if (this.isNew) {
      this.router.navigate(['/']);
    } else {
      this.articleSvc.publishArticle(this.article).then(() => this.router.navigate(['/']));
    }
  }

  publishArticle() {
    this.articleSvc.publishArticle(this.article).then((article: Article) => {
      this.article = article;
      this.isPublic = this.article.isPublic;
    });
  }

  unpublishArticle() {
    this.articleSvc.hideArticle(this.article).then((article: Article) => {
      this.article = article;
      this.isPublic = this.article.isPublic;
    });
  }

}
