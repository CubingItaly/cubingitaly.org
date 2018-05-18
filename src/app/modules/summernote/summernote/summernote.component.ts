import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'summernote',
  templateUrl: './summernote.component.html',
  styleUrls: ['./summernote.component.css']
})
export class SummernoteComponent implements OnInit {

  @Input() ngModel: string;
  @Output() ngModelChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    console.log(this.ngModel);
    $('#summernote').summernote({
      lang: 'it-IT',
      minHeight: 150,
      spellcheck: false
    });

    $('#summernote').summernote('code', this.ngModel);


    $('#summernote').on('summernote.change', (we, contents, $editable) => {
      this.ngModelChange.emit(contents);
    });
  }

}
