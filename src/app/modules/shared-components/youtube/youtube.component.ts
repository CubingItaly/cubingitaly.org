import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'youtube-widget',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})
export class YoutubeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadScript();
  }

  loadScript() {
    const script: string = 'https://apis.google.com/js/platform.js';
    const node = document.createElement('script');
    node.src = script;
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
