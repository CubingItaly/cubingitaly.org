import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {

  @Input() error: string = "La pagina richiesta non esiste";
  
  constructor() { }

  ngOnInit() {
  }

}
