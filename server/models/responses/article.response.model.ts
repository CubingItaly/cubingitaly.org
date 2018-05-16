import { autoserialize, inheritSerialization } from 'cerialize';
import { GenericResponse } from './generic.response.model';
import { Article } from '../article.model';

@inheritSerialization(GenericResponse)
export class ArticleResponse extends GenericResponse {

    constructor() {
        super();
    }

    @autoserialize public article: Article;

}