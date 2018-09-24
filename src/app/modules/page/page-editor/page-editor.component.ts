import { Component, OnInit, Input } from '@angular/core';
import * as Editor from '../../../../assets/ckeditor/ckeditor';
import { PageModel } from '../../../../../server/models/classes/page.model';

@Component({
  selector: 'page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.css']
})
export class PageEditorComponent implements OnInit {

  @Input() page: PageModel;
  editor = Editor;

  constructor() { }

  ngOnInit() {
  }

}
