import { Component, OnInit } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';
import { Validators, FormControl } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { OnDestroy } from '@angular/core';
import { MetaManagerService } from '../../services/meta-manager.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  subjectFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  messageFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);


  constructor(private dialog: MatDialog, private titleSVC: TitleManagerService, private contactSVC: ContactService, private metaSVC: MetaManagerService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Contatti");
    this.metaSVC.updateMeta("title", "Contatti");
    this.metaSVC.updateMeta("description", "Compila il form sottostante e sarai ricontattato al più presto via email.");
  }

  ngOnDestroy() {
    this.metaSVC.resetMeta();
  }

  submit() {
    if (this.messageFormControl.valid && this.emailFormControl.valid && this.subjectFormControl.valid && this.nameFormControl.valid) {
      this.contactSVC.sendMail(this.nameFormControl.value, this.emailFormControl.value, this.subjectFormControl.value, this.messageFormControl.value)
        .subscribe(() => {
          this.dialog.open(EmailSentDialogComponent, {
            minWidth: '200px',
          }).afterClosed().subscribe(() => {
            this.messageFormControl.reset();
            this.nameFormControl.reset();
            this.subjectFormControl.reset();
            this.emailFormControl.reset();
          });
        });
    }
  }
}

@Component({
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.css']
})
export class EmailSentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailSentDialogComponent>) { }

  ngOnInit() {
  }

}

