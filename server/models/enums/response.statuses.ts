/**
 * Defines the possible response statuses.
 * 
 * @export
 * @enum {number}
 */
export enum RESPONSE_STATUS {
  /**
   * Status OK. Everything went exactly as expected.
   */
  OK,
  /**
   * Status error. Something didn't work as expected, hence the operation didn't complete.
   */
  ERROR,
  /**
   * Status warning. Something didn't work as expected, but the operation did complete in any case.
   */
  WARN
}