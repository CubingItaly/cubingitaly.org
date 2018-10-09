import { ITransformable } from "../transformable";
import { Column, BaseEntity, ManyToMany, Entity, PrimaryColumn } from "typeorm";
import { ArticleCategoryModel } from "../../models/classes/category.model";
import { ArticleEntity } from "./article.entity";

/**
 * Database entity for the categories of articles of the website
 *
 * @export
 * @class ArticleCategoryEntity
 * @extends {BaseEntity}
 * @implements {ITransformable<ArticleCategoryModel>}
 */
@Entity()
export class ArticleCategoryEntity extends BaseEntity implements ITransformable<ArticleCategoryModel>{

    /**
     * Primary column, category id
     *
     * @type {string}
     * @memberof ArticleCategoryEntity
     */
    @PrimaryColumn()
    public id: string;

    /**
     * Category's name
     *
     * @type {string}
     * @memberof ArticleCategoryEntity
     */
    @Column({ nullable: false, length: 15 })
    public name: string;

    /**
     * The set of articles that belong to the category
     *
     * @type {ArticleEntity[]}
     * @memberof ArticleCategoryEntity
     */
    @ManyToMany(type => ArticleEntity, article => article.categories, { nullable: true })
    public articles: ArticleEntity[];

    /**
     * Takes in input a ArticleCategoryModel and copies its data
     *
     * @param {ArticleCategoryModel} origin
     * @memberof ArticleCategoryEntity
     */
    _assimilate(origin: ArticleCategoryModel): void {
        this.id = origin.id;
        this.name = origin.name;
    }

    /**
     * Returns an ArticleCategoryModel that is a copy of the current entity
     *
     * @returns {ArticleCategoryModel}
     * @memberof ArticleCategoryEntity
     */
    _transform(): ArticleCategoryModel {
        let category: ArticleCategoryModel = new ArticleCategoryModel();
        category.id = this.id;
        category.name = this.name;
        return category;
    }
}