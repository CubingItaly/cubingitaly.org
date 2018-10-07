import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../../server/models/classes/user.model';
import { Deserialize } from 'cerialize';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { of } from 'rxjs';


/**
 * Service use to manage the authentication of the user
 * 
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {

    private apiBase: string = "/api/v0";
    private cache: UserModel;
    private observable: Observable<UserModel>;
    private cacheTime: number;


    /**
     * Creates an instance of AuthService.
     * Retrieves user info and if the user is logged in, initializes the public attributes
     * 
     * @param {HttpClient} http 
     * @memberof AuthService
     */
    constructor(private http: HttpClient) {
    }

    public user(): Observable<UserModel> {
        let now = new Date();

        if (this.cache && ((now.getTime() - this.cacheTime) < 20000)) {
            return of(this.cache);
        } else if (this.observable) {
            return this.observable;
        } else {
            this.observable = this.http.get<UserModel>(this.apiBase + "/users/me")
                .pipe(share(), map(u => {
                    this.observable = null;
                    let tmp: UserModel = Deserialize(u, UserModel);
                    this.cache = tmp;
                    return this.cache;
                }));
            this.cacheTime = (new Date()).getTime();
            return this.observable;
        }
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