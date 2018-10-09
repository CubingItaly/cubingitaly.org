import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany, JoinTable } from "typeorm";
import { ITransformable } from "../transformable";
import { UserModel } from "../../models/classes/user.model";
import { RoleEntity } from "./role.entity";
import { ArticleEntity } from "./article.entity";
import { PageEntity } from "./page.entity";


/**
 * Database Entity that represents a User.
 *
 * @export
 * @class UserEntity
 * @extends {BaseEntity}
 * @implements {ITransformable<UserModel>}
 */
@Entity()
export class UserEntity extends BaseEntity implements ITransformable<UserModel>{

    /**
     * User's id, the same as on the WCA website.
     *
     * @type {number}
     * @memberof UserEntity
     */
    @PrimaryColumn()
    public id: number;

    /**
     * User's WCA id.
     * Null if the user never competed in a WCA competition.
     *
     * @type {string}
     * @memberof UserEntity
     */
    @Column({ nullable: true, length: 10 })
    public wcaId: string;

    /**
     * User's name.
     *
     * @type {string}
     * @memberof UserEntity
     */
    @Column({ nullable: false })
    public name: string;

    /**
     * Delegate status of the user.
     * Null if the user is not a delegate.
     *
     * @type {string}
     * @memberof UserEntity
     */
    @Column({ nullable: true })
    public delegateStatus: string;

    /**
     * Roles of the user in the teams of Cubing Italy.
     * Null if the user has no roles.
     *
     * @type {RoleEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => RoleEntity, role => role.user)
    public roles: RoleEntity[];

    /**
     * Articles published by the user.
     *
     * @type {ArticleEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => ArticleEntity, article => article.author, { nullable: true })
    public createdArticles: ArticleEntity[];

    /**
     * Articles of  which the user is the last editor.
     *
     * @type {ArticleEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => ArticleEntity, article => article.lastEditor, { nullable: true })
    public editedArticles: ArticleEntity[];


    @OneToMany(type => PageEntity, page => page.author, { nullable: true })
    public createdPages: PageEntity[];


    @OneToMany(type => PageEntity, page => page.lastEditor, { nullable: true })
    public editedPages: PageEntity[];


    /**
     * Takes a UserModel in input and copies its data.
     * Only user's personal information are assimilated, not roles and other relations.
     *
     * @param {UserModel} origin
     * @memberof UserEntity
     */
    _assimilate(origin: UserModel): void {
        this.id = origin.id;
        this.wcaId = origin.wca_id;
        this.name = origin.name;
        this.delegateStatus = origin.delegate_status;
    }

    /**
     * Returns a UserModel which is the copy of the current entity.
     * If present, roles are included.
     *
     * @returns {UserModel}
     * @memberof UserEntity
     */
    _transform(): UserModel {
        let user: UserModel = new UserModel();
        user.id = this.id;
        user.name = this.name;
        user.wca_id = this.wcaId;
        user.delegate_status = this.delegateStatus;
        if (this.roles !== undefined && this.roles !== null) {
            user.roles = this.roles.map((role: RoleEntity) => role._transform());
        }
        return user;
    }


}