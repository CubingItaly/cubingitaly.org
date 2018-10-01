import { Injectable, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class TitleManagerService {

  constructor(private title: Title) {
  }


  public setTitle(newTitle: string) {
    if (newTitle !== "Cubing Italy") {
      this.title.setTitle(newTitle + " | Cubing Italy");
    } else {
      this.title.setTitle("Cubing Italy");
    }
  }
}
