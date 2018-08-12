import { UserModel } from "./user.model";
import { autoserializeAs, autoserialize } from "cerialize";


/**
 * Basic text page, it can be used for many purposes
 *
 * @export
 * @class BasicPageModel
 */
export class BasicPageModel {

    /**
     * Page title
     *
     * @type {string}
     * @memberof BasicPageModel
     */
    @autoserialize
    public title: string;


    /**
     * Page content, the main content of the 
     *
     * @type {string}
     * @memberof BasicPageModel
     */
    @autoserialize
    public content: string;


    /**
     * Page creation date
     *
     * @type {Date}
     * @memberof BasicPageModel
     */
    @autoserialize
    public publishDate: Date;


    /**
     * Last page update date
     *
     * @type {Date}
     * @memberof BasicPageModel
     */
    @autoserialize
    public updateDate: Date;


    /**
     * Creator of the page
     *
     * @type {UserModel}
     * @memberof BasicPageModel
     */
    @autoserializeAs(UserModel)
    public author: UserModel;


    /**
     * Last editor of the page
     *
     * @type {UserModel}
     * @memberof BasicPageModel
     */
    @autoserializeAs(UserModel)
    public lastEditor: UserModel

}