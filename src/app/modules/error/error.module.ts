import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404/error404.component';
import { Error403Component } from './error403/error403.component';
import { routes } from './error.routing.module'
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Error404Component, Error403Component],
  exports: [Error403Component, Error404Component]
})
export class ErrorModule { }
