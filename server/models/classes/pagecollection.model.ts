import { autoserialize, autoserializeAs } from "cerialize";
import { SinglePageModel } from "./singlepage.model";

/**
 *
 *
 * @export
 * @class PageCollectionModel
 */
export class PageCollectionModel {


    /**
     * Unique id of the page collection
     *
     * @type {string}
     * @memberof PageCollectionModel
     */
    @autoserialize
    public id: string;


    /**
     * Title of the entire page collection
     *
     * @type {string}
     * @memberof PageCollectionModel
     */
    @autoserialize
    public title: string;


    /**
     * Whether the page collection is composed by one or more pages
     * True if it is a single page
     *
     * @type {boolean}
     * @memberof PageCollectionModel
     */
    @autoserialize
    public isSinglePage: boolean;


    /**
     * The total number of pages that compose the collection
     *
     * @type {number}
     * @memberof PageCollectionModel
     */
    @autoserialize
    public pagesNumber: number = 0;

    /**
     * List ofo the pages that belong to the collection
     *
     * @type {SinglePageModel[]}
     * @memberof PageCollectionModel
     */
    @autoserializeAs(SinglePageModel)
    public pages: SinglePageModel[] = [];

}