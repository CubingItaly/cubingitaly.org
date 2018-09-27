import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { PageModel } from '../../../../../server/models/classes/page.model';
import { PageService } from '../services/page.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { BadRequestError } from '../../../services/errors/bad.request.error';

@Component({
    selector: 'page-component',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit, OnChanges {

    @Input() pageId: number;
    @Input() viewing: boolean = true;
    @Input() titleEditor: boolean = false;

    @Output() pageUpdated: EventEmitter<string> = new EventEmitter<string>();

    page: PageModel;
    titleBackup: string;
    contentBackup: string;
    updated: boolean = false;

    constructor(private dialog: MatDialog, private pageSVC: PageService, private authSVC: AuthService) { }

    ngOnInit() {
        this.getPage();
    }

    restore() {
        this.page.content = this.contentBackup;
        this.page.title = this.titleBackup;
    }

    view() {
        this.viewing = true;
        this.scrollToTitle();
    }

    edit() {
        this.viewing = false;
    }

    updatePage() {
        if (this.page.title === "") {
            throw new BadRequestError("È necessario inserire un titolo.");
        }
        else if (this.page.title !== this.titleBackup || this.page.content !== this.contentBackup) {
            if (this.page.isPublic) {
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    minWidth: '200px',
                    data: "Sei sicuro di voler aggiornare la pagina? Le modifiche saranno visibili a chiunque."
                });
                dialogRef.afterClosed().subscribe((res: boolean) => {
                    if (res) {
                        this.updatePageToServer();
                    }
                });
            } else {
                this.updatePageToServer();
            }
        } else {
            this.showUpdateMessage();
            this.scrollToTitle();
        }
    }

    private getPage() {
        this.pageSVC.getPage(this.pageId).subscribe(res => {
            this.page = res;
            if (!this.page.content) {
                this.page.content = "";
            }
            this.contentBackup = this.page.content;
            this.titleBackup = this.page.title;
        });
    }

    private updatePageToServer() {
        this.pageSVC.updatePage(this.page).subscribe(res => {
            this.page = res;
            this.titleBackup = this.page.title;
            this.contentBackup = this.page.content;
            this.scrollToTitle();
            this.showUpdateMessage();
            this.pageUpdated.emit(this.page.title);
        });
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['pageId'].currentValue !== changes['pageId'].previousValue) {
            this.getPage();
        }
    }

    private scrollToTitle() {
        const pageTitle = document.querySelector('.page-title') as HTMLElement;
        pageTitle.scrollIntoView();
    }

    private showUpdateMessage() {
        this.updated = true;
        setTimeout(() => {
            this.updated = false;
        }, (7000));
    }
}
