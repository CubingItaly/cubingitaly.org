import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TutorialModel } from '../../../../../server/models/classes/tutorial.model';
import { TutorialService } from '../services/tutorial.service';
import { PageEvent } from '@angular/material';
import { TitleManagerService } from '../../../services/title-manager.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  tutorialId: string;
  tutorial: TutorialModel;
  pageIndex: number;
  currentPageId: number;


  constructor(private tutorialSVC: TutorialService, private route: ActivatedRoute, private router: Router, private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.tutorialId = this.route.snapshot.paramMap.get("id");
    this.pageIndex = Number(this.route.snapshot.paramMap.get("page")) || 1;
    this.tutorialSVC.getTutorial(this.tutorialId).subscribe(res => {
      this.tutorial = res;
      if (this.pageIndex < 1 || this.pageIndex > this.tutorial.pages.length) {
        this.pageIndex = 1;
      }
      this.router.navigate(['../' + this.pageIndex], { relativeTo: this.route });
      this.pageIndex--;
      this.currentPageId = this.tutorial.pages[this.pageIndex].id;
      this.titleSVC.setTitle(this.tutorial.title);
    });
  }

  pageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPageId = this.tutorial.pages[this.pageIndex].id;
    let redirectUrl = "../" + (this.pageIndex + 1);
    this.router.navigate([redirectUrl], { relativeTo: this.route });
    this.scrollToTop();
  }

  scrollToTop() {
    let top = document.querySelector('#top') as HTMLElement;
    top.scrollIntoView();
  }

}
