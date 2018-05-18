import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'summernote-viewer',
  templateUrl: './summernote-viewer.component.html',
  styleUrls: ['./summernote-viewer.component.css']
})
export class SummernoteViewerComponent implements OnInit {

  @Input() content: string;

  constructor() { }

  ngOnInit() {
  }

}
