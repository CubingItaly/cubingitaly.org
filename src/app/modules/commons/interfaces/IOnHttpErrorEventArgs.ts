import { HttpError } from "../classes/HttpError";
import { GenericResponse } from "../../../../../server/models/responses/generic.response.model";
/**
 * Interface defining the behavior of a common http error event.
 * The error instance is either an HTTP error, either a generic error out of a successfull http call.
 *
 * @export
 * @interface IOnHttpErrorEventArgs
 */
export interface IOnHttpErrorEventArgs {
  /**
   * Instance of the error thrown.
   *
   * @type {HttpError | GenericResponse}
   * @memberof IOnHttpErrorEventArgs
   */
  error: HttpError | GenericResponse;
}