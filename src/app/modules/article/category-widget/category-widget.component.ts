import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { ArticleCategoryModel } from '../../../../../server/models/classes/category.model';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'article-category-widget',
  templateUrl: './category-widget.component.html',
  styleUrls: ['./category-widget.component.css']
})
export class CategoryWidgetComponent implements OnInit {

  categories: ArticleCategoryModel[];
  @Input() selected: string = "";
  @Output() selectedChange = new EventEmitter();
  @Output() change = new EventEmitter();
  backup: string;
  constructor(private articleSVC: ArticleService) { }

  ngOnInit() {
    this.articleSVC.getCategories().subscribe(res => this.categories = res.sort((a, b) => {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }))
  }

  radioChange(event: MatRadioChange) {
    this.selectedChange.emit(event.value);
    this.change.emit(event.value);
  }

}
