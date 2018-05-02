import { autoserialize } from 'cerialize';
import { CIUser } from './ci.user.model';
import { CIMember } from './ci.member.model';


/**
 * Handles the generic properties of a Cubing Italy team 
 * 
 * @export
 * @class CITeam
 */
export class CITeam {

  /**
   * Shortname of the team
   * 
   * @type {string}
   * @memberof CITeam
   */
  @autoserialize public id: string;

  /**
   * Full name of the team
   * 
   * @type {string}
   * @memberof CITeam
   */
  @autoserialize public name: string;

  /**
   * List of the members of the team
   * 
   * @type {CIMember[]}
   * @memberof CITeam
   */
  @autoserialize public members: CIMember[];

}