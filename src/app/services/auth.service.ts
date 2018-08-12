import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../../server/models/classes/user.model';
import { TeamModel } from '../../../server/models/classes/team.model';

/**
 * Service use to manage the authentication of the user
 * 
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {

    public isLoggedIn: boolean = false;
    public authUser: UserModel;
    public userTeams: TeamModel[];
    private apiBase: string = "/api/v0";

    /**
     * Creates an instance of AuthService.
     * Retrieves user info and if the user is logged in, initializes the public attributes
     * 
     * @param {HttpClient} http 
     * @memberof AuthService
     */
    constructor(private http: HttpClient) {
        this.http.get<UserModel>(this.apiBase + "/users/me").subscribe((user: UserModel) => {
            this.authUser = user;
        });
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