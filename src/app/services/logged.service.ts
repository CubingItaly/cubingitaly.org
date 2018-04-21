import { Injectable } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { wca_user } from '../../../server/models/wca_user.model';
import { Serialize, Deserialize } from 'cerialize';

/**
 * A generic service holding whether the current user is logged in or what.
 * 
 * @export
 * @class LoggedInService
 */
@Injectable()
export class LoggedInService {
  protected static AUTH_USER_KEY: string = '_authUser';

  /**
   * Handles a protected temporary reference to a deserialized auth user.
   * 
   * @protected
   * @type {wca_user}
   * @memberof LoggedInService
   */
  protected _authUser: wca_user;

  /**
   * Default service constructor.
   * @param {CookieService} cookiesSvc 
   * @memberof LoggedInService
   */
  constructor(protected cookiesSvc: CookieService) {

  }

  /**
   * Checks whether the user is currently logged in.
   * 
   * @readonly
   * @type {boolean}
   * @memberof LoggedInService
   */
  public get isLoggedIn(): boolean {
    return this.cookiesSvc.check(LoggedInService.AUTH_USER_KEY) && this.cookiesSvc.get(LoggedInService.AUTH_USER_KEY) !== null;
  }

  /**
   * Handles the currently authenticated user.
   * 
   * @readonly
   * @type {wca_user}
   * @memberof LoggedInService
   */
  public get authUser(): wca_user {
    if (this.isLoggedIn) {
      // if the auth user is not yet defined, deserialize the current authUser instance which exists in the cookie.
      // Otherwise, keep the current value. This will avoid unwanted recalculations and reference issues.
      //console.log(JSON.parse(this.cookiesSvc.get(LoggedInService.AUTH_USER_KEY)));
      if (!this._authUser) {
        //console.log('deserializing into:');
        //console.log(JSON.parse(this.cookiesSvc.get(LoggedInService.AUTH_USER_KEY)));
        this._authUser = Deserialize(
          JSON.parse(this.cookiesSvc.get(LoggedInService.AUTH_USER_KEY)),
          wca_user
        );
        //console.log(this.cookiesSvc.get(LoggedInService.AUTH_USER_KEY));
      }

      return this._authUser;
    }
    return null;
  }

  /**
   * Performs the redirect to the WCA login page through the server middleware.protocol
   * 
   * @memberof LoggedInService
   */
  public WCA_login(): void {
    window.location.href = window.location.protocol + "//" + window.location.host + "/auth/wca";
  }


  /**
   * Performs the logout
   * On the WCA Website the logout is not performed
   * 
   * @memberof LoggedInService
   */
  public WCA_logout(): void {
    this.cookiesSvc.delete(LoggedInService.AUTH_USER_KEY);
    window.location.href = window.location.protocol + "//" + window.location.host + "/auth/logout";
  }
}