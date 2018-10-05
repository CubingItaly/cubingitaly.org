import { Component, OnInit, Input } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';

@Component({
  selector: 'article-category-viewer',
  templateUrl: './category-viewer.component.html',
  styleUrls: ['./category-viewer.component.css']
})
export class CategoryViewerComponent implements OnInit {

  @Input() article: ArticleModel;

  constructor() { }

  ngOnInit() {
  }

}
