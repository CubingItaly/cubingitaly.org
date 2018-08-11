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
     * @type {number}
     * @memberof ArticleCategoryModel
     */
    @autoserialize id: number;


    /**
     * Category name
     *
     * @type {string}
     * @memberof ArticleCategoryModel
     */
    @autoserialize name: string;


    /**
     * Hex color identifying the category, at the moment this is useless
     *
     * @type {string}
     * @memberof ArticleCategoryModel
     */
    @autoserialize color: string;


}