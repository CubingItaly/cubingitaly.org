import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'summernote-editor',
  templateUrl: './summernote.component.html',
  styleUrls: ['./summernote.component.css']
})
export class SummernoteComponent implements OnInit {

  /**
   * Content to be shown in the editor
   * 
   * @type {string}
   * @memberof SummernoteComponent
   */
  @Input() ngModel: string;
  /**
   * Event emitted when the editors content changes
   * 
   * @memberof SummernoteComponent
   */
  @Output() ngModelChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    //init summernote
    $('#summernote').summernote({
      lang: 'it-IT',
      minHeight: 150
    });

    //set initial summernote content
    $('#summernote').summernote('code', this.ngModel);

    //when the editor content changes, fire an event
    $('#summernote').on('summernote.change', (we, contents, $editable) => {
      this.ngModelChange.emit(contents);
    });
  }

}
