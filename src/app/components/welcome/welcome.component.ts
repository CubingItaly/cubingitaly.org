import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'welcome-widget',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  banner: string = "../../../assets/images/banner.jpg";
  banner_array: string[] = ["../../../assets/images/banner.jpg"];
  constructor() { }

  ngOnInit() {
  }

}
