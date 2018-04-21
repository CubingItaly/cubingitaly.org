import { autoserialize } from 'cerialize';

/**
 * Handles the generic properties of a wca user
 * 
 * @export
 * @class wca_user
 */
export class wca_user {
  /**
   * User's ID.
   * 
   * @type {number}
   * @memberof wca_user
   */
  @autoserialize public id: number;

  /**
   * User's WCA id.
   * 
   * @type {string}
   * @memberof wca_user
   */
  @autoserialize public wca_id: string;

  /**
   * User's name
   * 
   * @type {string}
   * @memberof wca_user
   */
  @autoserialize public name: string;

  /**
     * User's email
     * 
     * @type {string}
     * @memberof wca_user
     */
  @autoserialize public email: string;

  /**
   * Handles the delegate_status.
   * 
   * @type {string}
   * @memberof wca_user
   */
  @autoserialize public delegate_status: string;

  /**
   * Checks wether the user is delegate or not
   */
  @autoserialize public isDelegate(): boolean{
    return (this.delegate_status != null);
  }
}