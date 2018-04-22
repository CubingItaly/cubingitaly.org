import { autoserialize } from 'cerialize';

/**
 * Handles the generic properties of a Cubing Italy team 
 * 
 * @export
 * @class ci_team
 */
export class ci_team {
 
  /**
   * Team's ID
   * 
   * @type {number}
   * @memberof ci_team
   */
  @autoserialize public id: number;

  /**
   * Full name of the team
   * 
   * @type {string}
   * @memberof ci_team
   */
  @autoserialize public name: string;

  /**
   * Shortname of the team
   * 
   * @type {string}
   * @memberof ci_team
   */
  @autoserialize public shortname: string;
}