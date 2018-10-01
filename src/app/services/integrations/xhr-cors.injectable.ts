import { Injectable } from "@angular/core";
import { BrowserXhr } from "@angular/http";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.startsWith("/api/")) {
            request = request.clone({
                withCredentials: true
            });
        }
        return next.handle(request);
    }
}