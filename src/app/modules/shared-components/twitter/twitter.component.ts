import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'twitter-widget',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css']
})
export class TwitterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadScript();
  }

  loadScript() {
    const script: string = 'https://platform.twitter.com/widgets.js';
    const node = document.createElement('script');
    node.src = script;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
