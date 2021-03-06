import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout'
import { LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { routes } from './app.router';
import { sharingOptions } from './app.sharing';
import { environment } from '../environments/environment';

import { BrowserXhr } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CustomInterceptor } from './services/integrations/xhr-cors.injectable';
import { CookieService } from 'ng2-cookies';
import { AuthService } from './services/auth.service';

// animations module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';



//useful external components
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ShareButtonsModule } from '@ngx-share/buttons';


//locale
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt, 'it');
//components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserService } from './services/user.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';
import { CubingItalyErrorHandler } from './services/error.handler';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import '../icons';
import { SharedComponentsModule } from './modules/shared-components/shared-components.module';
import { ContactComponent, EmailSentDialogComponent } from './components/contact/contact.component';
import { UpcomingCompetitionsComponent } from './components/upcoming-competitions/upcoming-competitions.component';
import { MatCardModule, MatInputModule } from '@angular/material';
import { TitleManagerService } from './services/title-manager.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SlideshowModule } from 'ng-simple-slideshow';
import { LoginComponent } from './components/login/login.component';
import { PageModule } from './modules/page/page.module';
import { ProposedCompetitionsComponent } from './components/proposed-competitions/proposed-competitions.component';
import { MetaManagerService } from './services/meta-manager.service';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { SliderService } from './services/slider.service';
import { WCAService } from './services/wca.service';




@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolbarComponent,
    FooterComponent,
    NotFoundComponent,
    PermissionDeniedComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    ContactComponent,
    UpcomingCompetitionsComponent,
    WelcomeComponent,
    EmailSentDialogComponent,
    LoginComponent,
    ProposedCompetitionsComponent,
    BackToTopComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    AngularFontAwesomeModule,
    SharedComponentsModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    SlideshowModule,
    PageModule,
    ShareButtonsModule.forRoot({ options: sharingOptions }),
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled' })
  ],
  providers: [
    // Cors integration
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }, {
      provide: LOCALE_ID, useValue: "it-IT"
    },
    CookieService,
    AuthService,
    UserService,
    CubingItalyErrorHandler,
    UserService,
    TitleManagerService,
    MetaManagerService,
    SliderService,
    WCAService,
    { provide: ErrorHandler, useClass: CubingItalyErrorHandler }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [ConfirmDialogComponent, ErrorDialogComponent, EmailSentDialogComponent]
})
export class AppModule { }
