import { autoserialize, inheritSerialization, autoserializeAs } from 'cerialize';
import { BasicPageModel } from './basicpage.model';


/**
 * Single text page, used in page collections
 *
 * @export
 * @class SinglePageModel
 * @extends {BasicPageModel}
 */
@inheritSerialization(BasicPageModel)
export class SinglePageModel extends BasicPageModel {

    /**
     * Unique page id
     *
     * @type {number}
     * @memberof SinglePageModel
     */
    @autoserialize
    public id: number;

    /**
     * Unique page index used in the collection to sort the pages
     *
     * @type {number}
     * @memberof SinglePageModel
     */
    @autoserialize
    public inCollectionIndex: number = 0;

}