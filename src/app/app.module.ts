import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule} from '@angular/flex-layout'

import { AppComponent } from './app.component';
import { routes } from './app.router';
import { environment } from '../environments/environment';

import { BrowserXhr } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CustomInterceptor } from './services/integrations/xhr-cors.injectable';
import { LoggedInService } from './services/logged.service';
import { CookieService } from 'ng2-cookies';
import { AuthService } from './services/auth.service';

// animations module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material modules
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';

//components
import { CiToolbarComponent } from './components/ci-toolbar/ci-toolbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';






@NgModule({
  declarations: [
    AppComponent,
    CiToolbarComponent,
    DashboardComponent
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
    RouterModule.forRoot(routes)
  ],
  providers: [
    // Cors integration
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    },
    CookieService,
    // Inject the logged in service as a Singleton module, so that regardless which page uses it, we will always be aware whether the user is logged or not.
    LoggedInService,
    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
