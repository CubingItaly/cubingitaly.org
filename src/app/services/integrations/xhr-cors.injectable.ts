import { Injectable } from "@angular/core";
import { BrowserXhr } from "@angular/http";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    constructor() {
      console.log('custom interceptor has been loaded.');
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            withCredentials: true
        });
        return next.handle(request);
    }
}