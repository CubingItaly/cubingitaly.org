import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';
import { MetaManagerService } from '../../services/meta-manager.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  constructor(private titleSVC: TitleManagerService, private metaSVC: MetaManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Pagina non trovata");
    this.metaSVC.addMeta("robots", "noindex,nofollow");
  }

  ngOnDestroy() {
    this.metaSVC.removeMeta("robots");
  }

}
