import { Injectable } from '@angular/core';
import { wca_user } from '../../../server/models/wca_user.model';
import { standard_response } from '../../../server/models/standard_response.model';
import { Serialize, Deserialize } from 'cerialize';
import { ReducerObservable } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JSONP_ERR_NO_CALLBACK } from '@angular/common/http/src/jsonp';
import { ci_team } from '../../../server/models/ci_team.model';
import { RESPONSE_STATUS } from '../../../server/models/enums/response.statuses';

/**
 * Service use to manage the authentication of the user
 * 
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {

    public isLoggedIn: boolean = false;
    public authUser: wca_user;
    public userTeams: ci_team[];

    /**
     * Creates an instance of AuthService.
     * Retrieves user info and if the user is logged in, initializes the public attributes
     * 
     * @param {HttpClient} http 
     * @memberof AuthService
     */
    constructor(private http: HttpClient) {
        this.http.get("/auth/me").subscribe(res => {
            console.log("received response from the server");
            let tempres: standard_response = Deserialize(res, standard_response);
            if (tempres.status === RESPONSE_STATUS.OK) {
                this.authUser = tempres.user;
                this.userTeams = tempres.team;
                this.isLoggedIn = true;
            }
        });
    }

    /**
     * Method used to attempt a login through the WCA website
     * 
     * @memberof AuthService
     */
    public login(): void {
        console.log("Attempting a login");
        window.location.href = window.location.protocol + "//" + window.location.host + "/auth/wca";
    }

    /**
     * Method used to logout the user
     * 
     * @memberof AuthService
     */
    public logout(): void {
        console.log("Logging out");
        window.location.href = window.location.protocol + "//" + window.location.host + "/auth/logout";
    }

}