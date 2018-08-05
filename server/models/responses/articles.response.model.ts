import { autoserialize, inheritSerialization, Deserialize } from 'cerialize';
import { GenericResponse } from './generic.response.model';
import { Article } from '../article.model';

@inheritSerialization(GenericResponse)
export class ArticlesResponse extends GenericResponse {

    constructor() {
        super();
    }

    @autoserialize public articles?: Article[];

    /**
     * Handles the deserialization of this response.
     *
     * @param {ArticlesResponse} response
     * @returns {Article[]}
     * @memberof ArticlesResponse
     */
    public DeserializeResponse(response: ArticlesResponse) {
        if (!response || !response.articles) {
            return [];
        }
        else {
            return response.articles.map(e => Deserialize(e, Article));
        }
    }
}