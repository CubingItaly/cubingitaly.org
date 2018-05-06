import { GenericResponse } from "./generic.response";
import { autoserialize } from "cerialize";
import { CITeam } from "../ci.team.model";

/**
 * Indicates the kind of response given in the DBTeam entity context.
 * 
 * @export
 * @class TeamResponse
 * @extends {GenericResponse}
 */
export class TeamResponse extends GenericResponse {
  constructor() {
    super();
  }

  /**
   * Handles the list of teams type response.
   * 
   * @type {CITeam[]}
   * @memberof TeamResponse
   */
  @autoserialize public teamsList: CITeam[];
}