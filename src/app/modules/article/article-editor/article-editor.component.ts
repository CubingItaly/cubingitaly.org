import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { UserModel } from '../../../../../server/models/classes/user.model';
import { AuthService } from '../../../services/auth.service';
import { ArticleService } from '../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleCategoryModel } from '../../../../../server/models/classes/category.model';
import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BadRequestError } from '../../../services/errors/bad.request.error';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import * as Editor from '../../../../assets/ckeditor/ckeditor';
import { TitleManagerService } from '../../../services/title-manager.service';

@Component({
    selector: 'app-article-editor',
    templateUrl: './article-editor.component.html',
    styleUrls: ['./article-editor.component.css']
})
export class ArticleEditorComponent implements OnInit {
    article: ArticleModel = new ArticleModel();
    articleId: string;
    isNew: boolean;
    isPublic: boolean;
    articleLoaded: boolean = false;
    updated: boolean;

    categories: ArticleCategoryModel[];
    filteredCategories: ArticleCategoryModel[];
    categoryControl: FormControl = new FormControl();
    separatorKeysCodes: number[] = [ENTER, COMMA];
    selectable = true;
    removable = true;
    addOnBlur = false;

    editor = Editor;


    constructor(private dialog: MatDialog, private router: Router, private articleSVC: ArticleService, private route: ActivatedRoute, private titleSVC: TitleManagerService) { }

    ngOnInit() {
        this.articleSVC.getCategories().subscribe(result => { this.categories = result; this.filteredCategories = this.categories });

        let intent: string = this.route.snapshot.data.intent;
        if (intent === "new") {
            this.isNew = true;
            this.isPublic = false;
            this.article = new ArticleModel();
            this.article.content = "";
            this.articleLoaded = true;
            this.titleSVC.setTitle("Nuovo articolo");
        } else {
            this.articleId = this.route.snapshot.paramMap.get("id");
            this.articleSVC.getArticle(this.articleId).subscribe(article => {
                this.article = article;
                this.isNew = false;
                this.isPublic = article.isPublic;
                this.articleLoaded = true;
                if (this.article.categories && this.article.categories.length > 0) {
                    this.filteredCategories = this.categories.filter(cat => this.article.categories.findIndex(c => c.id == cat.id) == -1);
                }
            });
            this.titleSVC.setTitle("Modifica articolo");
        }
    }

    createArticle() {
        if (this.article.title) {
            this.articleSVC.createArticle(this.article).subscribe((result: ArticleModel) => {
                let redirecUrl = "/articoli/edit/" + result.id;
                this.router.navigate([redirecUrl]);
            });
        } else {
            throw new BadRequestError("Per poter creare un articolo è necessario inserire un titolo.");
        }
    }

    updateArticle() {
        if (this.isPublic) {
            let obs = this.createDialog("L'articolo che stai modifcando è pubblico e le modifiche saranno visibili da chiunque. Sei sicuro di voler procedere?");
            obs.subscribe((result: boolean) => {
                if (result) {
                    this.articleSVC.updateArticle(this.article).subscribe((result: ArticleModel) => {
                        this.article = result;
                        this.actionAfterUpdate();
                    });
                }
            });
        } else {
            this.articleSVC.updateArticle(this.article).subscribe((result: ArticleModel) => {
                this.article = result;
                this.actionAfterUpdate();
            });
        }


    }

    deleteArticle() {
        if (!this.isNew) {
            let obs = this.createDialog("Sei sicuro di voler cancellare l'articolo? L'azione non è reversibile e dopo che lo avrai cancellato nessuno potrà più recuperarlo.");
            obs.subscribe((result: boolean) => {
                if (result) {
                    this.articleSVC.deleteArticle(this.article).subscribe(() => {
                        this.router.navigate(['/articoli/admin']);
                    });
                }
            });
        } else {
            this.router.navigate(['/articoli/admin']);
        }

    }

    publishArticle() {
        if (this.article.title && this.article.content && this.article.summary) {
            let obs = this.createDialog("Sei sicuro di voler pubblicare l'articolo? Dopo che lo avrai pubblicato chiunque potrà vedere l'articolo.");
            obs.subscribe((result: boolean) => {
                if (result) {
                    this.articleSVC.publishArticle(this.article).subscribe((result: ArticleModel) => {
                        this.article = result;
                        this.isPublic = true;
                        this.actionAfterUpdate();
                    });
                }
            });
        } else {
            throw new BadRequestError("Per poter pubblicare un articolo è necessario inserire titolo, riassunto e contenuto.");
        }

    }

    unpublishArticle() {
        let obs = this.createDialog("Sei sicuro di voler annullare la pubblicazione dell'articolo? Dopo che avrai annullato la pubblicazione l'articolo non sarà più visibile al pubblico.");
        obs.subscribe((result: boolean) => {
            if (result) {
                this.articleSVC.unpublishArticle(this.article).subscribe((result: ArticleModel) => {
                    this.article = result;
                    this.isPublic = false;
                    this.actionAfterUpdate();
                });
            }
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

    add(event: MatChipInputEvent): void {
        event.input.value = "";
    }

    remove(id: string): void {
        let category: ArticleCategoryModel = this.categories.find(c => c.id === id);
        this.article.categories = this.article.categories.filter(c => c.id !== id);
        this.filteredCategories.push(category);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        let category: ArticleCategoryModel = this.categories.find(c => c.id === event.option.value);
        this.article.categories.push(category);
        this.filteredCategories = this.filteredCategories.filter(c => c.id !== category.id);
    }
}
