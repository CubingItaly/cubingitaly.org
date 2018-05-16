import { autoserialize, inheritSerialization } from 'cerialize';
import { GenericResponse } from './generic.response.model';
import { Article } from '../article.model';

@inheritSerialization(GenericResponse)
export class ArticlesResponse extends GenericResponse {

    constructor() {
        super();
    }

    @autoserialize public articles?: Article[];

}