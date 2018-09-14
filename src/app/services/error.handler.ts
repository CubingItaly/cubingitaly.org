import { ErrorHandler, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";


export class CubingItalyErrorHandler extends ErrorHandler {

    constructor(private injector: Injector) { super(); }

    handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            const router = this.injector.get(Router);
            if (error.status === 404) {
                router.navigate(['not-found']);
            } else if (error.status === 403) {
                router.navigate(['permission-denied']);
            }
        } else {
            console.log(error);
            throw (error);
        }
    }
}