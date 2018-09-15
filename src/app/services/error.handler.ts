import { ErrorHandler, Injector, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { BadRequestError } from "./errors/bad.request.error";
import { MatDialog } from "@angular/material";
import { ErrorDialogComponent } from "../components/error-dialog/error-dialog.component";


export class CubingItalyErrorHandler extends ErrorHandler {

    constructor(private injector: Injector) { super(); }

    handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            const router = this.injector.get(Router);
            const zone = this.injector.get(NgZone);
            if (error.status === 404) {
                zone.run(() => router.navigate(['not-found']));
            } else if (error.status === 403) {
                zone.run(() => router.navigate(['permission-denied']));
            } else {
                const dialog = this.injector.get(MatDialog);
                dialog.open(ErrorDialogComponent, {
                    minWidth: '200px',
                    data: error.message
                });
            }
        } else if (error instanceof BadRequestError) {
            const dialog = this.injector.get(MatDialog);
            dialog.open(ErrorDialogComponent, {
                minWidth: '200px',
                data: error.message
            });
        } else {
            console.log(error);
            throw (error);
        }
    }
}