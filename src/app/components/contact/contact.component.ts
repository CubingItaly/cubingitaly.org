import { Component, OnInit } from '@angular/core';
import { TitleManagerService } from '../../services/title-manager.service';
import { Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

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
    Validators.minLength(3),
  ]);

  messageFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);


  constructor(private dialog: MatDialog, private titleSVC: TitleManagerService, private contactSVC: ContactService) { }

  ngOnInit() {
    this.titleSVC.setTitle("Contatti");

    const script: string = 'https://www.instagram.com/embed.js';
    const node = document.createElement('script');
    node.src = script;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
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

