import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ArticleCategoryModel } from './category.model';
import { UserModel } from './user.model';

/**
 *
 *
 * @export
 * @class ArticleModel
 */
export class ArticleModel {

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


    /**
     * Article title
     *
     * @type {string}
     * @memberof ArticleModel
     */
    @autoserialize
    public title: string;


    /**
     * Article content, the main content of the article
     *
     * @type {string}
     * @memberof ArticleModel
     */
    @autoserialize
    public content: string;


    /**
     * Article publishing date
     *
     * @type {Date}
     * @memberof ArticleModel
     */
    @autoserialize
    public publishDate: Date;


    /**
     * Last article update date
     *
     * @type {Date}
     * @memberof ArticleModel
     */
    @autoserialize
    public updateDate: Date;


    /**
     * Creator of the article
     *
     * @type {UserModel}
     * @memberof ArticleModel
     */
    @autoserializeAs(UserModel)
    public author: UserModel;


    /**
     * Last editor of the article
     *
     * @type {UserModel}
     * @memberof ArticleModel
     */
    @autoserializeAs(UserModel)
    public lastEditor: UserModel;



}