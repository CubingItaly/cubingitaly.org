import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { BasicPageModel } from './basicpage.model';
import { ArticleCategoryModel } from './category.model';

/**
 *
 *
 * @export
 * @class ArticleModel
 * @extends {BasicPageModel}
 */
@inheritSerialization(BasicPageModel)
export class ArticleModel extends BasicPageModel {

    /**
     * Unique article id, it is 
     *
     * @type {string}
     * @memberof ArticleModel
     */
    @autoserialize
    public id: string;



    /**
     * Summary of the article
     *
     * @type {string}
     * @memberof ArticleModel
     */
    @autoserialize
    public summary: string;


    /**
     * Whether the article is public or not.
     * True if it is public
     */
    @autoserialize
    public isPublic: boolean = false;


    /**
     * List of categories to which the article belongs
     *
     * @type {ArticleCategoryModel[]}
     * @memberof ArticleModel
     */
    @autoserializeAs(ArticleCategoryModel)
    public categories: ArticleCategoryModel[] = [];

}