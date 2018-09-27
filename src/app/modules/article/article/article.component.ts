import { Component, OnInit } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../services/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article: ArticleModel;

  constructor(private authSVC: AuthService, private articleSVC: ArticleService, private route: ActivatedRoute) { }

  ngOnInit() {
    let articleId: string = this.route.snapshot.paramMap.get("id");
    this.articleSVC.getArticle(articleId).subscribe(article => this.article = article);
  }

}
