import { Entity, BaseEntity, Column, ManyToOne, CreateDateColumn, PrimaryColumn, OneToMany } from "typeorm";
import { ITransformable } from "../transformable";
import { UserEntity } from "./user.entity";
import { TutorialModel } from "../../models/classes/tutorial.model";
import { PageEntity } from "./page.entity";

/**
 * Database entity that represents a Tutorial
 *
 * @export
 * @class TutorialEntity
 * @extends {TutorialEntity}
 */
@Entity()
export class TutorialEntity extends BaseEntity implements ITransformable<TutorialModel> {

    @PrimaryColumn()
    public id: string;

    @Column({ length: 120, nullable: false })
    public title: string;

    @Column({ nullable: false })
    public isPublic: boolean;

    @CreateDateColumn()
    public createDate: Date;

    @Column({ nullable: true })
    public updateDate: Date;

    @ManyToOne(type => UserEntity, user => user.createdPages, { nullable: true })
    public author: UserEntity;

    @ManyToOne(type => UserEntity, user => user.editedPages, { nullable: true })
    public lastEditor: UserEntity;

    @OneToMany(type => PageEntity, page => page.tutorial, { cascade: true, eager: true, nullable: true })
    public pages: PageEntity[];



    _transform(): TutorialModel {
        let model: TutorialModel = new TutorialModel();
        model.id = this.id;
        model.title = this.title;
        model.isPublic = this.isPublic;
        model.createDate = this.createDate;
        model.updateDate = this.updateDate;
        if (this.author !== undefined) {
            model.author = this.author._transform();
        }
        if (this.lastEditor !== undefined) {
            model.lastEditor = this.lastEditor._transform();
        }
        if (this.pages) {
            model.pages = this.pages.map(p => ({ id: p.id, indexInTutorial: p.indexInTutorial, title: p.title }));
            model.pages.sort((a, b) => {
                if (a.indexInTutorial < b.indexInTutorial)
                    return -1;
                if (a.indexInTutorial > b.indexInTutorial)
                    return 1;
                return 0;
            });
        }
        return model;
    }

    _assimilate(origin: TutorialModel): void {
        this.id = origin.id;
        this.title = origin.title;
        this.isPublic = origin.isPublic || false;
        if (origin.author !== undefined) {
            this.author = new UserEntity();
            this.author._assimilate(origin.author);
        }
        if (origin.lastEditor !== undefined) {
            this.lastEditor = new UserEntity();
            this.lastEditor._assimilate(origin.lastEditor);
        }
        this.updateDate = origin.updateDate;
        this.createDate = origin.createDate;
    }
}