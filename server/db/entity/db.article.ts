import { Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, RelationOptions, JoinTable } from 'typeorm';
import { DBArticleCategory } from './db.article.category';
import { DBUser } from './db.user';
import { ITransformable } from '../transformable';
import { Article } from '../../models/article.model';


@Entity()
export class DBArticle extends BaseEntity implements ITransformable<Article>{

    @PrimaryColumn()
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column("text", { nullable: true })
    content: string;

    @Column({ length: 200, nullable: true })
    summary: string;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column({ nullable: false })
    isPublic: boolean;

    @ManyToMany(type => DBArticleCategory, category => category.articles, { eager: true, nullable: true } as RelationOptions)
    @JoinTable()
    categories: DBArticleCategory[];

    @ManyToOne(type => DBUser, user => user.articles, { eager: true, nullable: false })
    author: DBUser

    _assimilate(origin): void {
        this.id = origin.id || null
        this.title = origin.title;
        this.content = origin.content || "";
        this.summary = origin.summary || "";
        this.isPublic = origin.isPublic || false;

        if (origin.creationDate) {
            this.creationDate = origin.creationDate;
        }
        if (origin.updateDate) {
            this.updateDate = origin.updateDate;
        }

        if (origin.categories) {
            this.categories = origin.categories.map(cat => {
                let db_category: DBArticleCategory = new DBArticleCategory();
                db_category._assimilate(cat);
                return db_category;
            });
        }

        this.author = new DBUser();
        this.author._assimilate(origin.author);

    }

    _transform(): Article {
        let article: Article = new Article();
        article.id = this.id;
        article.title = this.title;
        article.content = this.content;
        article.summary = this.summary;
        article.isPublic = this.isPublic;
        article.creationDate = this.creationDate;
        article.updateDate = this.updateDate;
        if (this.categories) {
            article.categories = this.categories.map(cat => cat._transform());
        }
        article.author = this.author._transform();

        return article;
    }
}
