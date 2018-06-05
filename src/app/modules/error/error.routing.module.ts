import { Route } from '@angular/router';
import { Error404Component } from './error404/error404.component';
import { Error403Component } from './error403/error403.component';


export const routes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: '404' },
    { path: '404', component: Error404Component },
    { path: '403', component: Error403Component }
] 