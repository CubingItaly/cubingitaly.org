import { autoserialize, inheritSerialization } from 'cerialize';
import { GenericResponse } from './generic.response.model';

@inheritSerialization(GenericResponse)
export class GenericNumberResponse extends GenericResponse {

    constructor() {
        super();
    }

    @autoserialize public value?: number;

}