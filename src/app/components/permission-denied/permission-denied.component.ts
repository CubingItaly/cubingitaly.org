import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';
import { MetaManagerService } from '../../services/meta-manager.service';

@Component({
  selector: 'app-permission-denied',
  templateUrl: './permission-denied.component.html',
  styleUrls: ['./permission-denied.component.css']
})
export class PermissionDeniedComponent implements OnInit, OnDestroy {

  constructor(private titleSVC: TitleManagerService, private metaSVC: MetaManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Permesso negato");
    this.metaSVC.addMeta("robots", "noindex,nofollow");
  }

  ngOnDestroy() {
    this.metaSVC.removeMeta("robots");
  }
}
