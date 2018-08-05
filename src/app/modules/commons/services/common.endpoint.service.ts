import { HttpClient } from "@angular/common/http";
import { HttpError } from "../classes/HttpError";
import { Observable } from "rxjs";
import { IOnHttpErrorEventArgs } from "../interfaces/IOnHttpErrorEventArgs";
import { IDeserializableResponse } from "../../../../../server/models/interfaces/IDeserializableResponse";
import { GenericResponse } from "../../../../../server/models/responses/generic.response.model";
import { RESPONSE_STATUS } from "../../../../../server/models/enums/response.statuses";
import { map, catchError } from 'rxjs/operators';

/**
 * Defines the common behavior used by literally every single service that performs http calls.
 *
 * @export
 * @class CommonEndpointService
 */
export class CommonEndpointService {
  /**
   * Holds a generic error string that is thrown whenever a generic error happens and the client is unable to determine the issue.
   *
   * @static
   * @type {string}
   * @memberof CommonEndpointService
   */
  public static ERR_UNKNOWN: string = 'An unkown error happened, please retry later.';

  /**
   * Creates a new instance of a CommonEndpointService.
   * @param {HttpClient} http
   * @memberof CommonEndpointService
   */
  constructor(public http: HttpClient) {

  }

  /**
   * Handles, locally, a generic error.
   *
   * @param {IOnHttpErrorEventArgs} e event args
   * @memberof CommonEndpointService
   */
  public onError(e: IOnHttpErrorEventArgs) {
    let errorMessage: string;
    if (e.error instanceof HttpError) {
      errorMessage = e.error.ErrorMessage;
    }
    else {
      errorMessage = (e.error as GenericResponse).error || CommonEndpointService.ERR_UNKNOWN;
    }
    // TODO: spawn something, like a snackbar or whatever.
  }

  /**
   * Performs a post request, returning a promise holding either the response, either the error.
   *
   * @template T Response type
   * @template F Expected parsed response type
   * @template Z Request type (not mandatory, use `any` if you don't want to fill this).
   * @param {string} endpoint http endpoint to call (full URI)
   * @param {Z} data data to send
   * @param {(args: IOnHttpErrorEventArgs) => void} [onError] Event thrown whenever an error is thrown. 
   * @returns {Promise<T>} A promise holding either the successfull result, either `null` if an error occurred.
   * @memberof CommonEndpointService
   */
  public async POST<T extends IDeserializableResponse & GenericResponse, F, Z>(endpoint: string, data: Z, onError?: (args: IOnHttpErrorEventArgs) => void): Promise<F> {
    const result = this.http.post<T>(endpoint, data);
    return await (this.handleResponse(result, onError) as Observable<F>).toPromise();
  }

  /**
   * Same as the POST request, but using a GET request instead.
   *
   * @see POST
   * @template T
   * @template F
   * @template Z
   * @param {string} endpoint
   * @param {(args: IOnHttpErrorEventArgs) => void} [onError]
   * @returns {Promise<F>}
   * @memberof CommonEndpointService
   */
  public async GET<T extends IDeserializableResponse & GenericResponse, F, Z>(endpoint: string, onError?: (args: IOnHttpErrorEventArgs) => void): Promise<F> {
    const result = this.http.get<T>(endpoint);
    return await (this.handleResponse(result, onError) as Observable<F>).toPromise();
  }

  private handleResponse<T extends IDeserializableResponse & GenericResponse, F, Z>(res: Observable<T>, onError?: (args: IOnHttpErrorEventArgs) => void): Observable<F> {
    return res.pipe(
      map((r: T) => {
        // Map the result according to the deserializable entity.
        if (r.status === RESPONSE_STATUS.OK) {
          return r.DeserializeResponse(r);
        }
        // Otherwise, if something went somehow wrong somewhere, handle the error.
        else {
          const err = {
            error: r as GenericResponse
          } as IOnHttpErrorEventArgs;
          // Throw the local error.
          this.onError(err);
          // Fire registered events, if any.
          onError && onError.call(null, err);
        }
      }),
      catchError((e) => {
        console.log('error occurred.');
        console.log(e);
        const error = new HttpError(e);
        // Common error handling goes here.
        const err = {
          error: error
        } as IOnHttpErrorEventArgs;
        // Throw the local error.
        this.onError(err);
        // Fire registered events, if ay.
        onError && onError.call(null, {
          error: error
        });
        return Observable.throw(null);
      })
    )
  }
}
