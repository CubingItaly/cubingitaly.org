import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TutorialModel } from '../../../../../server/models/classes/tutorial.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'tutorial-summary-widget',
  templateUrl: './tutorial-summary.component.html',
  styleUrls: ['./tutorial-summary.component.css']
})
export class TutorialSummaryComponent implements OnInit {

  @Input() tutorial: TutorialModel;
  @Input() selectedPage: number;
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  pages: { id: number, title: string }[] = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.tutorial.pages.length; i++) {
      this.pages.push({ id: (i + 1), title: this.tutorial.pages[i].title });
    }
  }

  urlClick(id: number) {
    let event: PageEvent = new PageEvent();
    event.pageIndex = id - 1;
    this.page.emit(event);
  }

}
