import { ITransformable } from "../transformable";
import { BaseEntity, Column, ManyToOne, PrimaryColumn, OneToMany, Entity } from "typeorm";
import { PageCollectionModel } from "../../models/classes/pagecollection.model";
import { SinglePageEntity } from "./singlepage.entity";
import { SinglePageModel } from "../../models/classes/singlepage.model";


/**
 * Database entity for the PageCollections of the website
 *
 * @export
 * @class PageCollectionEntity
 * @extends {BaseEntity}
 * @implements {ITransformable<PageCollectionModel>}
 */
@Entity()
export class PageCollectionEntity extends BaseEntity implements ITransformable<PageCollectionModel> {

    /**
     * Id of the collection, it's derived from the title
     *
     * @type {string}
     * @memberof PageCollectionEntity
     */
    @PrimaryColumn()
    public id: string;

    /**
     * Title of the collection
     *
     * @type {string}
     * @memberof PageCollectionEntity
     */
    @Column({ nullable: false, length: 100 })
    public title: string;


    /**
     * Whether the collection is composed by one or more pages
     *
     * @type {boolean}
     * @memberof PageCollectionEntity
     */
    @Column({ nullable: false })
    public isSinglePage: boolean = true;


    /**
     * The total number of pages that compose the collection
     *
     * @type {number}
     * @memberof PageCollectionEntity
     */
    @Column({ nullable: false })
    public pagesNumber: number;

    /**
     * The set of pages that compose the collection
     *
     * @type {SinglePageEntity[]}
     * @memberof PageCollectionEntity
     */
    @OneToMany(type => SinglePageEntity, page => page.collection, { nullable: true })
    public pages: SinglePageEntity[];


    /**
     * Takes a PageCollectionModel in input and copies its data
     *
     * @param {PageCollectionModel} origin
     * @memberof PageCollectionEntity
     */
    _assimilate(origin: PageCollectionModel): void {
        this.id = origin.id || "";
        this.title = origin.id;
        this.isSinglePage = origin.isSinglePage || true;
        this.pagesNumber = origin.pagesNumber || 0;
        this.pages = origin.pages.map((page: SinglePageModel) => {
            let tmp: SinglePageEntity = new SinglePageEntity();
            tmp._assimilate(page);
            return tmp;
        });
    }


    /**
     * Returns a PageCollectionModel which is the copy of the current entity
     *
     * @returns {PageCollectionModel}
     * @memberof PageCollectionEntity
     */
    _transform(): PageCollectionModel {
        let collection: PageCollectionModel = new PageCollectionModel();
        collection.id = this.id;
        collection.title = this.title;
        collection.isSinglePage = this.isSinglePage;
        collection.pagesNumber = this.pagesNumber;
        collection.pages = this.pages.map((page: SinglePageEntity) => page._transform());
        return collection;
    }
}