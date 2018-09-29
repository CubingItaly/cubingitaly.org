import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../../server/models/classes/user.model';
import { Deserialize } from 'cerialize';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service use to manage the authentication of the user
 * 
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {

    private apiBase: string = "/api/v0";
    public user: Observable<UserModel>;
    /**
     * Creates an instance of AuthService.
     * Retrieves user info and if the user is logged in, initializes the public attributes
     * 
     * @param {HttpClient} http 
     * @memberof AuthService
     */
    constructor(private http: HttpClient) {
        this.user = this.http.get<UserModel>(this.apiBase + "/users/me").pipe(map(u => Deserialize(u, UserModel)));
    }

    /**
     * Method used to attempt a login through the WCA website
     * 
     * @memberof AuthService
     */
    public login(): void {
        window.location.href = window.location.protocol + "//" + window.location.host + this.apiBase + "/auth/wca";
    }

    /**
     * Method used to logout the user
     * 
     * @memberof AuthService
     */
    public logout(): void {
        window.location.href = window.location.protocol + "//" + window.location.host + this.apiBase + "/auth/logout";
    }

}