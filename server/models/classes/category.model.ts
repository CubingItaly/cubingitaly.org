import { autoserialize } from "cerialize";

/**
 *
 *
 * @export
 * @class ArticleCategoryModel
 */
export class ArticleCategoryModel {


    /**
     * Category unique ID
     *
     * @type {string}
     * @memberof ArticleCategoryModel
     */
    @autoserialize id: string;


    /**
     * Category name
     *
     * @type {string}
     * @memberof ArticleCategoryModel
     */
    @autoserialize name: string;

}