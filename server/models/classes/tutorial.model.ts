import { autoserialize, autoserializeAs } from "cerialize";
import { PageModel } from "./page.model";
import { UserModel } from "./user.model";

/**
 *
 *
 * @export
 * @class TutorialModel
 */
export class TutorialModel {


    /**
     * Unique id of the page tutorial
     *
     * @type {string}
     * @memberof TutorialModel
     */
    @autoserialize
    public id: string;


    /**
     * Title of the entire page tutorial
     *
     * @type {string}
     * @memberof TutorialModel
     */
    @autoserialize
    public title: string;


    /**
     * Whether the tutorial is public or not
     *
     * @type {boolean}
     * @memberof TutorialModel
     */
    @autoserialize
    public isPublic: boolean;


    /**
     * List ofo the pages that belong to the tutorial
     *
     * @type {SinglePageModel[]}
     * @memberof TutorialModel
     */
    @autoserialize
    public pages: { id: number, indexInTutorial:number, title: string }[] = [];


    /**
     * Page creation date
     *
     * @type {Date}
     * @memberof TutorialModel
     */
    @autoserialize
    public createDate: Date;


    /**
     * Last page update date
     *
     * @type {Date}
     * @memberof TutorialModel
     */
    @autoserialize
    public updateDate: Date;


    /**
     * Creator of the page
     *
     * @type {UserModel}
     * @memberof TutorialModel
     */
    @autoserializeAs(UserModel)
    public author: UserModel;


    /**
     * Last editor of the page
     *
     * @type {UserModel}
     * @memberof TutorialModel
     */
    @autoserializeAs(UserModel)
    public lastEditor: UserModel;

}