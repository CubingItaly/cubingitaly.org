import { autoserialize, inheritSerialization } from 'cerialize';
import { GenericResponse } from './generic.response.model';
import { ArticleCategory } from '../article.category.model';

@inheritSerialization(GenericResponse)
export class CategoriesResponse extends GenericResponse {

    constructor() {
        super();
    }

    @autoserialize public categories?: ArticleCategory[];

}