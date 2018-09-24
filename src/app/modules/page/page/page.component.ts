import { Component, OnInit, Input } from '@angular/core';
import { PageModel } from '../../../../../server/models/classes/page.model';
import { PageService } from '../services/page.service';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'page-component',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

    @Input() pageId: number;
    page: PageModel;
    viewing: boolean = true;
    backup: string;
    updated: boolean = false;

    constructor(private dialog: MatDialog, private pageSVC: PageService, private authSVC: AuthService) { }

    ngOnInit() {
        this.pageSVC.getPage(this.pageId).subscribe(res => { this.page = res; this.backup = this.page.content; });
    }

    restore() {
        this.page.content = this.backup;
    }

    view() {
        window.scrollTo(0, 0);
        this.viewing = true;
    }

    edit() {
        this.viewing = false;
    }

    updatePage() {
        if (this.page.content !== this.backup) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                minWidth: '200px',
                data: "Sei sicuro di voler aggiornare la pagina? Le modifiche saranno visibili a chiunque."
            });
            dialogRef.afterClosed().subscribe((res: boolean) => {
                if (res) {
                    this.pageSVC.updatePage(this.page).subscribe(res => {
                        this.page = res;
                        this.backup = this.page.content;
                        window.scrollTo(0, 0);
                        this.updated = true;
                        setTimeout(() => {
                            this.updated = false;
                        }, (7000));
                    });
                }
            });
        }
    }
}
