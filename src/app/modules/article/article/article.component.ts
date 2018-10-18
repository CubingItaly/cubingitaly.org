import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { Title } from '@angular/platform-browser';
import { TitleManagerService } from '../../../services/title-manager.service';
import { MetaManagerService } from '../../../services/meta-manager.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, OnDestroy {

  article: ArticleModel;

  constructor(private articleSVC: ArticleService, private route: ActivatedRoute, private titleSVC: TitleManagerService, private metaSVC: MetaManagerService) { }

  ngOnInit() {
    let articleId: string = this.route.snapshot.paramMap.get("id");
    this.articleSVC.getArticle(articleId).subscribe(article => {
      this.article = article;
      this.titleSVC.setTitle(this.article.title);
      this.metaSVC.updateMeta("title", this.article.title);
      this.metaSVC.updateMeta("description", this.article.summary);
      this.metaSVC.updateMeta("og:title", this.article.title);
      this.metaSVC.updateMeta("og:description", this.article.summary);
    });
  }

  ngOnDestroy() {
    this.metaSVC.resetMeta();
  }

}
