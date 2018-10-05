import { autoserialize, inheritSerialization, autoserializeAs } from 'cerialize';
import { UserModel } from './user.model';

/**
 * Single text page, used in page tutorials
 *
 * @export
 * @class PageModel
 */
export class PageModel {

    /**
     * Unique page id
     *
     * @type {number}
     * @memberof PageModel
     */
    @autoserialize
    public id: number;

    /**
    * Page title
    *
    * @type {string}
    * @memberof PageModel
    */
    @autoserialize
    public title: string;


    /**
     * Page content, the main content of the 
     *
     * @type {string}
     * @memberof PageModel
     */
    @autoserialize
    public content: string;


    /**
     * Page creation date
     *
     * @type {Date}
     * @memberof PageModel
     */
    @autoserialize
    public createDate: Date;


    /**
     * Last page update date
     *
     * @type {Date}
     * @memberof PageModel
     */
    @autoserialize
    public updateDate: Date;


    /**
     * Creator of the page
     *
     * @type {UserModel}
     * @memberof PageModel
     */
    @autoserializeAs(UserModel)
    public author: UserModel;


    /**
     * Last editor of the page
     *
     * @type {UserModel}
     * @memberof PageModel
     */
    @autoserializeAs(UserModel)
    public lastEditor: UserModel;


    /**
     * Index of the page in the tutorial
     *
     * @type {number}
     * @memberof PageModel
     */
    @autoserialize
    public indexInTutorial: number;


    /**
     * Whether the page is public or not.
     * It reflects the status of the tutorial
     *
     * @type {boolean}
     * @memberof PageModel
     */
    @autoserialize
    public isPublic: boolean;
}