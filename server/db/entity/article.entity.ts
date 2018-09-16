import { ITransformable } from "../transformable";
import { Column, PrimaryColumn, ManyToMany, ManyToOne, Entity, UpdateDateColumn, CreateDateColumn, BaseEntity, JoinTable } from "typeorm";
import { ArticleModel } from "../../models/classes/article.model";
import { ArticleCategoryEntity } from "./category.entity";
import { UserEntity } from "./user.entity";
import { ArticleCategoryModel } from "../../models/classes/category.model";


/**
 * Database entity for the website articles
 *
 * @export
 * @class ArticleEntity
 * @extends {BasicPageEntity}
 * @implements {ITransformable<ArticleModel>}
 */
@Entity()
export class ArticleEntity extends BaseEntity implements ITransformable<ArticleModel>{

    /**
     * The id of the article, it is derived from the title and is unique
     *
     * @type {string}
     * @memberof ArticleEntity
     */
    @PrimaryColumn()
    public id: string;

    /**
     * Title of the page
     *
     * @type {string}
     * @memberof BasicPageEntity
     */
    @Column({ nullable: false, length: 120 })
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
    @Column({ nullable: true })
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
     * Summary of the article
     *
     * @type {string}
     * @memberof ArticleEntity
     */
    @Column({ nullable: true, length: 250 })
    public summary: string;

    /**
     * Whether the article is public or not
     *
     * @type {boolean}
     * @memberof ArticleEntity
     */
    @Column({ nullable: false, default: false })
    public isPublic: boolean;


    /**
     * Cetegories to which the article belongs to
     *
     * @type {ArticleCategoryEntity[]}
     * @memberof ArticleEntity
     */
    @ManyToMany(type => ArticleCategoryEntity, category => category.articles, { nullable: true, eager: true })
    @JoinTable()
    public categories: ArticleCategoryEntity[];

    /**
     * Author of the article, it is set when the article goes public for the first time
     *
     * @type {UserEntity}
     * @memberof ArticleEntity
     */
    @ManyToOne(type => UserEntity, user => user.createdArticles, { nullable: true })
    @JoinTable()
    public author: UserEntity;

    /**
     * Last editor of the article, every time someone edits it, it changes
     *
     * @type {UserEntity}
     * @memberof ArticleEntity
     */
    @ManyToOne(type => UserEntity, user => user.editedArticles, { nullable: true })
    @JoinTable()
    public lastEditor: UserEntity;

    /**
     * Takes an ArticleModel in input and copies its data
     *
     * @param {ArticleModel} origin
     * @memberof ArticleEntity
     */
    _assimilate(origin: ArticleModel): void {
        this.id = origin.id;
        this.summary = origin.summary;
        this.isPublic = origin.isPublic || false;

        this.categories = origin.categories.map((category: ArticleCategoryModel) => {
            let tmp: ArticleCategoryEntity = new ArticleCategoryEntity();
            tmp._assimilate(category);
            return tmp;
        });

        this.title = origin.title;
        this.content = origin.content;
        this.publishDate = origin.publishDate;
        this.updateDate = origin.updateDate;
        if (origin.author !== undefined) {
            this.author = new UserEntity();
            this.author._assimilate(origin.author);
        }
        if (origin.lastEditor !== undefined) {
            this.lastEditor = new UserEntity();
            this.lastEditor._assimilate(origin.lastEditor);
        }

    }

    /**
     * Returns an ArticleModel which is the copy of the current entity
     *
     * @returns {ArticleModel}
     * @memberof ArticleEntity
     */
    _transform(): ArticleModel {
        let article: ArticleModel = new ArticleModel();
        article.id = this.id;
        article.title = this.title;
        article.summary = this.summary;
        article.isPublic = this.isPublic;
        if (this.categories !== undefined && this.categories !== null) {
            article.categories = this.categories.map((c: ArticleCategoryEntity) => c._transform());
        }
        article.content = this.content;
        if (this.author !== undefined && this.author !== null) {
            article.author = this.author._transform();
        }

        if (this.lastEditor !== undefined && this.lastEditor !== null) {
            article.lastEditor = this.lastEditor._transform();
        }
        article.publishDate = this.publishDate;
        article.updateDate = this.updateDate;
        return article;
    }
}