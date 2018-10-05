import { Component, OnInit } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';

@Component({
  selector: 'app-permission-denied',
  templateUrl: './permission-denied.component.html',
  styleUrls: ['./permission-denied.component.css']
})
export class PermissionDeniedComponent implements OnInit {

  constructor(private titleSVC: TitleManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Permesso negato");
  }

}
