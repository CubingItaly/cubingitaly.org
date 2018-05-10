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
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';




import { AngularFontAwesomeModule } from 'angular-font-awesome';


//components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';






@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolbarComponent
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
    AngularFontAwesomeModule,
    
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
    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
