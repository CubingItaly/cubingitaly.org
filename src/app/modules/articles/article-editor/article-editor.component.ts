import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../../server/models/article.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ArticlesService } from '../services/articles.service';
import { ArticleCategory } from '../../../../../server/models/article.category.model';
import { AuthService } from '../../../services/auth.service';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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

  categoryControl = new FormControl();
  separatorKeysCodes = [ENTER, COMMA];



  ngOnInit() {
    this.user = this.authSvc.authUser;
    this.articleSvc.getCategories().then(c => this.categories = c);

    let action: number = this.route.snapshot.data.action;

    if (action == 0) {
      this.isNew = true;
      this.isPublic = false;
      this.article = new Article();
      
    } else {
      this.articleId = this.route.snapshot.paramMap.get('id');
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
      this.router.navigate(['../../admin'], {relativeTo: this.route});
    } else {
      this.articleSvc.deleteArticle(this.article).then(() => this.router.navigate(['../../admin'], {relativeTo: this.route}));
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

  add(event: MatChipInputEvent): void {

  }

  selected(event: MatAutocompleteSelectedEvent) {
    let category: ArticleCategory;
    category = this.categories.find(c => c.id == event.option.value)
    this.categories = this.categories.filter(c => c.id != category.id);

    if (!this.article.categories) {
      this.article.categories = []
    }
    this.article.categories.push(category);
  }

  remove(id: number): void {
    let category: ArticleCategory = this.article.categories.find(c => c.id == id);
    this.article.categories = this.article.categories.filter(c => c.id != id);
    this.categories.push(category);
  }
}
