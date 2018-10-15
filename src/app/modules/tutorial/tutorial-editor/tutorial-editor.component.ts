import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TutorialModel } from '../../../../../server/models/classes/tutorial.model';
import { TutorialService } from '../services/tutorial.service';
import { PageModel } from '../../../../../server/models/classes/page.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { BadRequestError } from '../../../services/errors/bad.request.error';
import { TitleManagerService } from '../../../services/title-manager.service';

@Component({
  selector: 'app-tutorial-editor',
  templateUrl: './tutorial-editor.component.html',
  styleUrls: ['./tutorial-editor.component.css']
})
export class TutorialEditorComponent implements OnInit {

  isNew: boolean;
  isPublic: boolean;
  tutorial: TutorialModel;
  tutorialId: string;
  updated: boolean = false;
  newPageTitle: string = "";
  displayedColumns = ['title', 'edit', 'delete', 'up', 'down'];

  editingPage: boolean = false;
  currentEditingPageId: number;

  constructor(private dialog: MatDialog, private tutorialSVC: TutorialService, private route: ActivatedRoute, private router: Router, private titleSVC: TitleManagerService) { }


  ngOnInit() {
    let intent: string = this.route.snapshot.data.intent;
    if (intent === "new") {
      this.isNew = true;
      this.isPublic = false;
      this.tutorial = new TutorialModel();
      this.titleSVC.setTitle("Nuovo tutorial");
    } else {
      this.tutorialId = this.route.snapshot.paramMap.get("id");
      this.getTutorial();
      this.titleSVC.setTitle("Modifica tutorial");
    }
  }

  createTutorial() {
    if (this.tutorial.title && this.tutorial.title !== "") {
      this.tutorialSVC.createTutorial(this.tutorial.title).subscribe(res => {
        let redirectUrl: string = "/tutorial/edit/" + res.id;
        this.router.navigate([redirectUrl]);
      });
    } else {
      throw new BadRequestError("È necessario inserire un titolo per poter creare un nuovo tutorial.");
    }

  }

  updateTutorial() {
    if (!this.tutorial.isPublic) {
      this.tutorialSVC.updateTutorial(this.tutorial).subscribe(res => {
        this.tutorial = res;
        this.actionAfterUpdate();
      });
    } else {
      this.createDialog("Il tutorial che stai modificando è pubblico e le modifiche saranno visibili da chiunque. Sei sicuro di voler procedere?")
        .subscribe((res: boolean) => {
          if (res) {
            this.tutorialSVC.updateTutorial(this.tutorial).subscribe(res => {
              this.tutorial = res;
              this.actionAfterUpdate();
            });
          }
        });
    }

  }

  publishTutorial() {
    if (this.tutorial.title && this.tutorial.pages.length > 0) {
      this.createDialog("Sei sicuro di voler pubblicare il tutorial? Dopo che lo avrai pubblicato chiunque potrà vederlo.")
        .subscribe((result: boolean) => {
          if (result) {
            this.tutorialSVC.publishTutorial(this.tutorial).subscribe(res => {
              this.tutorial = res;
              this.isPublic = true;
              this.actionAfterUpdate();
            });
          }
        });
    } else {
      throw new BadRequestError("Per poter pubblicare un tutorial è necessario inserire il titolo e almeno una pagina");
    }
  }

  unpublishTutorial() {
    this.createDialog("Sei sicuro di voler annullare la pubblicazione del tutorial? Dopo che lo avrai nascosto sarà visibile solamente a chi ha il permesso.")
      .subscribe((res: boolean) => {
        if (res) {
          this.tutorialSVC.unpublishTutorial(this.tutorial).subscribe(res => {
            this.tutorial = res;
            this.isPublic = false;
            this.actionAfterUpdate();
          });
        }
      });
  }


  deleteTutorial() {
    if (!this.isNew) {
      this.createDialog("Sei sicuro di eliminare il tutorial? Dopo che lo avrai eliminato non sarà più recuperabile.")
        .subscribe((res: boolean) => {
          if (res) {
            this.tutorialSVC.deleteTutorial(this.tutorial.id).subscribe(res => {
              this.router.navigate(["/tutorial/admin"]);
            });
          }
        });
    } else {
      this.router.navigate(["/tutorial"]);
    }
  }



  addPage() {
    if (this.newPageTitle) {
      let page: PageModel = new PageModel();
      page.title = this.newPageTitle;
      this.tutorialSVC.addPage(this.tutorial, page).subscribe(res => { this.tutorial = res; this.newPageTitle = ""; });
    } else {
      throw new BadRequestError("Per aggiungere una nuova pagina è necessario inserire un titolo.");
    }
  }

  movePage(id: number, delta: number) {
    let tmp: { id: number, title: string } = this.tutorial.pages.find(p => p.id === id);
    let page: PageModel = new PageModel
    this.tutorialSVC.movePage(this.tutorial, id, delta).subscribe(res => this.tutorial = res);
  }

  removePage(id: number) {
    if (!this.isPublic || (this.isPublic && this.tutorial.pages.length > 1)) {
      this.createDialog("Sei sicuro di voler rimuovere la pagina? Una volta cancellata non sarà più recuperabile.")
        .subscribe((res: boolean) => {
          if (res) {
            let page: PageModel = new PageModel();
            page.id = id;
            this.tutorialSVC.removePage(this.tutorial, page).subscribe(res => this.tutorial = res);
          }
        })
    } else {
      throw new BadRequestError("Il tutorial è pubblico e quindi deve avere almeno una pagina.");
    }
  }

  private getTutorial() {
    this.tutorialSVC.adminGetTutorial(this.tutorialId).subscribe(res => {
      this.tutorial = res;
      this.isNew = false;
      this.isPublic = this.tutorial.isPublic;
    });
  }

  private actionAfterUpdate() {
    const pageTitle = document.querySelector('h1') as HTMLElement;
    pageTitle.scrollIntoView();
    this.updated = true;
    setTimeout(() => {
      this.updated = false;
    }, 7000);
  }

  private createDialog(message: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '200px',
      data: message
    });

    return dialogRef.afterClosed();
  }

  editPage(id: number) {
    if (this.currentEditingPageId === id) {
      this.editingPage = !this.editingPage;
    } else {
      this.editingPage = true;
      this.currentEditingPageId = id;
    }
  }

}
