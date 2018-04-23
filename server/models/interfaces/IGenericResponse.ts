import { RESPONSE_STATUS } from "../enums/response.statuses";

/**
 * Handles a generic behavior that needs to be implement for any kind of response.
 * 
 * @export
 * @interface IGenericResponse
 */
export interface IGenericResponse {
  /**
   * Defines the response status. See {@link RESPONSE_STATUS}
   * 
   * @type {RESPONSE_STATUS}
   * @memberof IGenericResponse
   */
  status: RESPONSE_STATUS;
  /**
   * Defines the error, if any.
   * 
   * @type {string}
   * @memberof IGenericResponse
   */
  error?: string;
}