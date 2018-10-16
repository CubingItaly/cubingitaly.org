import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.css']
})
export class BackToTopComponent implements OnInit {

  visible: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  scrollToTop() {
    const top = document.querySelector('#top') as HTMLElement;
    top.scrollIntoView();
  }

}
