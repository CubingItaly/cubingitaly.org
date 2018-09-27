import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'share-page-widget',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  @Input() pageName: string = "";

  constructor() { }

  ngOnInit() {
  }

}
