import { HttpErrorResponse } from "@angular/common/http";

/**
 * Handles common prototypes and data related to a generic http error response.
 *
 * @export
 * @class HttpError
 */
export class HttpError {
  public static ERR_BAD_REQUEST: number = 400;
  public static ERR_INTERNAL_SERVER_ERROR: number = 500;

  constructor(public originalError: HttpErrorResponse) {}

  /**
   * Returns the error message acquired out of the http call.
   *
   * @readonly
   * @type {string}
   * @memberof HttpError
   */
  public get ErrorMessage(): string {
    return this.originalError.error;
  }

  /**
   * Establish whether this error is a Bad Request error.
   *
   * @returns {boolean}
   * @memberof HttpError
   */
  public isBadRequest(): boolean {
    return this.originalError.status === HttpError.ERR_BAD_REQUEST;
  }

  /**
   * Establish whether this error is an Internal Server Error.
   *
   * @returns {boolean}
   * @memberof HttpError
   */
  public isInternalServerError(): boolean {
    return this.originalError.status === HttpError.ERR_INTERNAL_SERVER_ERROR;
  }
}