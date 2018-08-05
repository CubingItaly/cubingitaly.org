import { autoserialize, inheritSerialization, Deserialize, autoserializeAs } from 'cerialize';
import { GenericResponse } from './generic.response.model';
import { Article } from '../article.model';

@inheritSerialization(GenericResponse)
export class ArticleResponse extends GenericResponse {

    constructor() {
        super();
    }

    @autoserializeAs(Article) public article: Article;

    /**
     * Handles the deserialization of this response.
     *
     * @param {ArticleResponse} response
     * @returns {Article}
     * @memberof ArticleResponse
     */
    public DeserializeResponse(response: ArticleResponse): Article {
        return Deserialize(response.article, Article);
    }
}