import { autoserialize } from 'cerialize';
import { IGenericResponse } from '../interfaces/IGenericResponse';
import { RESPONSE_STATUS } from '../enums/response.statuses';


export class GenericResponse implements IGenericResponse {

    /**
     * Object that contains the status of the response
     * 
     * @type {RESPONSE_STATUS}
     * @memberof GenericResponse
     */
    @autoserialize public status: RESPONSE_STATUS;

    /**
     * Nullable string that contains the error message in case of negative result
     * 
     * @type {string}
     * @memberof GenericResponse
     */
    @autoserialize public error: string;

}