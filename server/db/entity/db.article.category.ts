import { Entity, PrimaryColumn, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany, ManyToMany, RelationOptions } from 'typeorm';
import { DBArticle } from './db.article';
import { ITransformable } from '../transformable';
import { ArticleCategory } from '../../models/article.category.model';

@Entity()
export class DBArticleCategory extends BaseEntity implements ITransformable<ArticleCategory> {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    color: string;

    @ManyToMany(type => DBArticle, article => article.categories, { nullable: true } as RelationOptions)
    articles: DBArticle[];

    _assimilate(origin: ArticleCategory): void {
        this.id = origin.id;
        this.name = origin.name;
        this.color = origin.color;
    }

    _transform(): ArticleCategory {
        let category: ArticleCategory = new ArticleCategory();
        category.id = this.id;
        category.name = this.name;
        category.color = this.color;
        return category;
    }
}
