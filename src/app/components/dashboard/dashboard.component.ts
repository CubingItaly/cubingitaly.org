import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleModel } from '../../../../server/models/classes/article.model';
import { ArticleService } from '../../modules/article/services/article.service';
import { TitleManagerService } from '../../services/title-manager.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private articleSVC: ArticleService, private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Cubing Italy");
  }

}
