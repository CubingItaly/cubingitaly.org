import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share/share.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { RoleDirective } from './directives/role.directive';
import { FacebookComponent } from './facebook/facebook.component';
import { ArticleListViewerComponent } from './article-list-viewer/article-list-viewer.component';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TwitterComponent } from './twitter/twitter.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        ShareButtonsModule,
        MatCardModule,
        RouterModule,
        MatButtonModule
    ],
    declarations: [ShareComponent, RoleDirective, FacebookComponent, ArticleListViewerComponent, TwitterComponent],
    exports: [ShareComponent, RoleDirective, FacebookComponent, ArticleListViewerComponent, TwitterComponent]
})
export class SharedComponentsModule { }
