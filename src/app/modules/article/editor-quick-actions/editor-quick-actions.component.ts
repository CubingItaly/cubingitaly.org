import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'article-editor-quick-actions',
  templateUrl: './editor-quick-actions.component.html',
  styleUrls: ['./editor-quick-actions.component.css']
})
export class EditorQuickActionsComponent implements OnInit {

  @Input() articleId: string;
  @Input() editing: boolean = false;

  constructor() { }
  
  ngOnInit() {
  }

}
