import { Component, OnInit } from '@angular/core';
import { images } from '../../../assets/images/banner/image-array';

@Component({
  selector: 'welcome-widget',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  bannerArray: string[];
  constructor() { }

  ngOnInit() {
    this.bannerArray = images;
  }

}
