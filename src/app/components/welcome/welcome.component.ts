import { Component, OnInit } from '@angular/core';
import { Deserialize } from 'cerialize';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

@Component({
  selector: 'welcome-widget',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  bannerArray: string[];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/assets/images/banner/image-array.json').subscribe((data: { images: string[] }) => {
      this.bannerArray = data.images.map(path => Deserialize(path, String));
    });
  }

}
