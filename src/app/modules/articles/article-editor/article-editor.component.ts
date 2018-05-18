import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import 'rxjs/add/operator/debounceTime';


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
  filteredCategories: ArticleCategory[];

  user: CIUser;

  articleLoaded: boolean = false;

  constructor(private authSvc: AuthService, private route: ActivatedRoute, private router: Router, private articleSvc: ArticlesService) { }

  categoryControl = new FormControl();
  //Separators used in the categories input
  separatorKeysCodes = [ENTER, COMMA];

  @ViewChild('categoryInput') catInput: ElementRef;



  async ngOnInit() {
    //Get the current user and the categories list
    this.user = this.authSvc.authUser;
    this.categories = await this.articleSvc.getCategories();

    //Get the intent used to open the page. 0 => new article, 1 => edit article
    let action: number = this.route.snapshot.data.action;

    if (action == 0) {
      this.isNew = true;
      this.isPublic = false;
      this.article = new Article();

    } else {
      //Get the article id from the URL and then retrieve the article
      this.articleId = this.route.snapshot.paramMap.get('id');
      this.article = await this.articleSvc.getArticle(this.articleId);
      this.isPublic = this.article.isPublic;
      this.isNew = false;
    }

    //Loading phase finished, now we can show the text editor
    this.articleLoaded = true;

    this.categories = this.categories.filter(cat => this.article.categories.findIndex(c => c.id == cat.id) == -1);

    this.categoryControl.valueChanges.debounceTime(400).subscribe();
  }

  /**
   * Creates a new article, then redirects the user to the article's editor page
   * 
   * @memberof ArticleEditorComponent
   */
  createArticle() {
    this.articleSvc.createArticle(this.article).then((article: Article) => {
      let redirect_url: string = "/articles/" + article.id + "/edit";
      this.router.navigate([redirect_url]);
    });
  }

  /**
   * Updates the article
   * 
   * @memberof ArticleEditorComponent
   */
  updateArticle() {
    this.articleSvc.updateArticle(this.article).then((article: Article) => {
      this.article = article;
      this.isPublic = this.article.isPublic;
    });
  }

  /**
   * Deletes the article and redirects to the article manager
   * 
   * @memberof ArticleEditorComponent
   */
  deleteArticle() {
    if (this.isNew) {
      this.router.navigate(['../../admin'], { relativeTo: this.route });
    } else {
      this.articleSvc.deleteArticle(this.article).then(() => this.router.navigate(['../../admin'], { relativeTo: this.route }));
    }
  }

  /**
   * Publish the article
   * 
   * @memberof ArticleEditorComponent
   */
  publishArticle() {
    this.articleSvc.publishArticle(this.article).then((article: Article) => {
      this.article = article;
      this.isPublic = this.article.isPublic;
    });
  }

  /**
   * Make the article unlisted
   * 
   * @memberof ArticleEditorComponent-
   */
  unpublishArticle() {
    this.articleSvc.hideArticle(this.article).then((article: Article) => {
      this.article = article;
      this.isPublic = this.article.isPublic;
    });
  }


  /** Methods relative to the categories editor */

  add(event: MatChipInputEvent): void {
    event.input.value = "";
  }

  selected(event: MatAutocompleteSelectedEvent) {
    let category: ArticleCategory;
    category = this.categories.find(c => c.id == event.option.value)
    this.categories = this.categories.filter(c => c.id != category.id);

    if (!this.article.categories) {
      this.article.categories = []
    }
    this.article.categories.push(category);
    this.catInput.nativeElement.value = "";
  }

  remove(id: number): void {
    let category: ArticleCategory = this.article.categories.find(c => c.id == id);
    this.article.categories = this.article.categories.filter(c => c.id != id);
    this.categories.push(category);
  }
}
