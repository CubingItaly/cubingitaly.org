import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'welcome-widget',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  bannerArray: string[] = [
    "../../../assets/images/banner/_MG_1110.jpg",
    "../../../assets/images/banner/_MG_3432.jpg",
    "../../../assets/images/banner/_MG_3444.jpg",
    "../../../assets/images/banner/_MG_3480.jpg",
    "../../../assets/images/banner/_MG_1082.jpg",
  ];
  constructor() { }

  ngOnInit() {
    //this.changeImage(0);
  }

}
