import { autoserialize } from "cerialize";
import { RESPONSE_STATUS } from "../enums/response.statuses";
import { IGenericResponse } from "../interfaces/IGenericResponse";

export class GenericResponse implements IGenericResponse {
   
    /**
     * Boolean which indicates the result of the request
     * 
     * @type {RESPONSE_STATUS}
     * @memberof standard_response
     */
    @autoserialize public status: RESPONSE_STATUS;

    /**
     * Nullable string that contains the error message in case of negative result
     * 
     * @type {string}
     * @memberof standard_response
     */
    @autoserialize public error: string;
}