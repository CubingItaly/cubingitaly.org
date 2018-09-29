import { Component, OnInit } from '@angular/core';
import { TutorialModel } from '../../../../../server/models/classes/tutorial.model';
import { TutorialService } from '../services/tutorial.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tutorial-admin',
  templateUrl: './tutorial-admin.component.html',
  styleUrls: ['./tutorial-admin.component.css']
})
export class TutorialAdminComponent implements OnInit {

  tutorials$: Observable<TutorialModel[]>;
  displayedColumns: string[] = ["title", "editor", "update", "status", "options"];

  constructor(private tutorialSVC: TutorialService) { }

  ngOnInit() {
    this.tutorials$ = this.tutorialSVC.getAllTutorials();
  }

}
