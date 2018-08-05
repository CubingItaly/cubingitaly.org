import { autoserialize } from 'cerialize';
import { RESPONSE_STATUS } from '../enums/response.statuses';

export class GenericRequest {
  /**
   * Represents a generic identifier used for any kind of request.
   * 
   * @type {number}
   * @memberof GenericRequest
   */
  @autoserialize public id: number;
}