import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TutorialService } from '../services/tutorial.service';
import { TutorialModel } from '../../../../../server/models/classes/tutorial.model';
import { TitleManagerService } from '../../../services/title-manager.service';
import { MetaManagerService } from '../../../services/meta-manager.service';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css']
})
export class TutorialListComponent implements OnInit, OnDestroy {

  tutorials: TutorialModel[];
  pageId: number = 2;

  constructor(private tutorialSVC: TutorialService, private titleSVC: TitleManagerService, private metaSVC: MetaManagerService) { }

  ngOnInit() {
    this.tutorialSVC.getTutorials().subscribe((res: TutorialModel[]) => this.tutorials = res.sort((a, b) => {
      if (a.title < b.title)
        return -1;
      if (a.title > b.title)
        return 1;
      return 0;
    })
    );
    this.titleSVC.setTitle("Tutorial");
    this.metaSVC.updateMeta("title", "Tutorial");
    this.metaSVC.updateMeta("description", "In questa pagina trovi un elenco di tutorial redatti dal Team Qualità di Cubing Italy");
  }

  ngOnDestroy() {
    this.metaSVC.resetMeta();
  }

}
