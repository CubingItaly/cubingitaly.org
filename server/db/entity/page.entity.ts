import { Entity, BaseEntity, Column, ManyToOne, JoinTable, getCustomRepository, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ITransformable } from "../transformable";
import { PageModel } from "../../models/classes/page.model";
import { UserEntity } from "./user.entity";
import { TutorialEntity } from "./tutorial.entity";

/**
 * Database entity that represents a Page of a Tutorial
 *
 * @export
 * @class PageEntity
 * @extends {PageEntity}
 */
@Entity()
export class PageEntity extends BaseEntity implements ITransformable<PageModel> {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 120, nullable: true })
    public title: string;

    @Column({ type: "text", nullable: true })
    public content: string;

    @CreateDateColumn()
    public createDate: Date;

    @UpdateDateColumn({ nullable: true })
    public updateDate: Date;

    @ManyToOne(type => UserEntity, user => user.createdPages, { nullable: true })
    public author: UserEntity;

    @ManyToOne(type => UserEntity, user => user.editedPages, { nullable: true })
    public lastEditor: UserEntity;

    @Column({ type: "int", nullable: false })
    public indexInTutorial: number;

    @Column({ nullable: false })
    public isPublic: boolean

    @ManyToOne(type => TutorialEntity, tutorial => tutorial.pages, { nullable: true })
    public tutorial: TutorialEntity;



    _transform(): PageModel {
        let model: PageModel = new PageModel();
        model.id = this.id;
        model.title = this.title;
        model.content = this.content;
        model.createDate = this.createDate;
        model.updateDate = this.updateDate;
        if (this.author)
            model.author = this.author._transform();
        if (this.lastEditor)
            model.lastEditor = this.lastEditor._transform();
        model.isPublic = this.isPublic || false;
        model.indexInTutorial = this.indexInTutorial || -1;
        return model
    }

    _assimilate(origin: PageModel): void {
        this.id = origin.id;
        this.title = origin.title;
        this.content = origin.content;
        this.createDate = origin.createDate;
        this.updateDate = origin.updateDate;
        this.isPublic = origin.isPublic || false;
        this.indexInTutorial = origin.indexInTutorial || -1;
        if (origin.author) {
            let tmp: UserEntity = new UserEntity();
            tmp._assimilate(origin.author);
            this.author = tmp;
        }
        if (origin.lastEditor) {
            let tmp: UserEntity = new UserEntity();
            tmp._assimilate(origin.lastEditor);
            this.author = tmp;
        }
    }
}