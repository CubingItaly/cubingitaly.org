import { ITransformable } from "../transformable";
import { SinglePageModel } from "../../models/classes/singlepage.model";
import { Column, PrimaryGeneratedColumn, ManyToOne, Entity, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { UserEntity } from "./user.entity";
import { PageCollectionEntity } from "./pagecollection.entity";


/**
 * The database entity of the SinglePageModel, used by Page Collections
 *
 * @export
 * @class SinglePageEntity
 * @extends {BasicPageEntity}
 * @implements {ITransformable<SinglePageModel>}
 */
@Entity()
export class SinglePageEntity extends BaseEntity implements ITransformable<SinglePageModel>{

    /**
     * Page id
     *
     * @type {number}
     * @memberof SinglePageEntity
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * Title of the page
     *
     * @type {string}
     * @memberof BasicPageEntity
     */
    @Column({ nullable: false, length: 100 })
    public title: string;


    /**
     * Main content of the page
     *
     * @type {string}
     * @memberof BasicPageEntity
     */
    @Column({ type: "text", nullable: true })
    public content: string;


    /**
     * Automatically inserted when the page is created
     *
     * @type {Date}
     * @memberof BasicPageEntity
     */
    @CreateDateColumn()
    public publishDate: Date;


    /**
     * Automatically updates every time the page is edited
     *
     * @type {Date}
     * @memberof BasicPageEntity
     */
    @UpdateDateColumn()
    public updateDate: Date;

    /**
     * Index in the page collection, it is used to sort the pages
     *
     * @type {number}
     * @memberof SinglePageEntity
     */
    @Column({ nullable: false })
    public inCollectionIndex: number;

    /**
     * Author of the page
     *
     * @type {UserEntity}
     * @memberof SinglePageEntity
     */
    @ManyToOne(type => UserEntity, user => user.createdPages, { eager: true, nullable: true })
    public author: UserEntity;

    /**
     * Last editor of the page
     *
     * @type {UserEntity}
     * @memberof SinglePageEntity
     */
    @ManyToOne(type => UserEntity, user => user.editedPages, { eager: true, nullable: true })
    public lastEditor: UserEntity;

    /**
     * Page collection to which the entity belongs
     *
     * @type {PageCollectionEntity}
     * @memberof SinglePageEntity
     */
    @ManyToOne(type => PageCollectionEntity, collection => collection.pages)
    public collection: PageCollectionEntity;


    /**
     * Takes a SinglePageModel in input and copies its data
     *
     * @param {SinglePageModel} origin
     * @memberof SinglePageEntity
     */
    _assimilate(origin: SinglePageModel): void {
        this.id = origin.id || null;
        this.inCollectionIndex = origin.inCollectionIndex || 0;
        this.title = origin.title;
        this.content = origin.content || "";
        this.publishDate = origin.publishDate || null;
        this.updateDate = origin.updateDate || null;
        if (origin.author !== undefined) {
            this.author._assimilate(origin.author);
        }
        if (origin.lastEditor !== undefined){
            this.lastEditor._assimilate(origin.lastEditor);
        }
    }

    /**
     * Returns a SinglePageModel which is the copy of the current entity
     *
     * @returns {SinglePageModel}
     * @memberof SinglePageEntity
     */
    _transform(): SinglePageModel {
        let page: SinglePageModel = new SinglePageModel();
        page.id = this.id;
        page.inCollectionIndex = this.inCollectionIndex;
        page.title = this.title;
        page.content = this.content;
        page.publishDate = this.publishDate;
        page.updateDate = this.updateDate;
        page.author = this.author._transform();
        page.lastEditor = this.lastEditor._transform();
        return page;
    }
}