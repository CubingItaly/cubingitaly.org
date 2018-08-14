import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany, JoinTable } from "typeorm";
import { ITransformable } from "../transformable";
import { UserModel } from "../../models/classes/user.model";
import { RoleEntity } from "./role.entity";
import { RoleModel } from "../../models/classes/role.model";
import { ArticleEntity } from "./article.entity";
import { SinglePageEntity } from "./singlepage.entity";


/**
 * Database Entity that represents a User 
 *
 * @export
 * @class UserEntity
 * @extends {BaseEntity}
 * @implements {ITransformable<UserModel>}
 */
@Entity()
export class UserEntity extends BaseEntity implements ITransformable<UserModel>{

    /**
     * User's id, the same as on the WCA website
     *
     * @type {number}
     * @memberof UserEntity
     */
    @PrimaryColumn()
    public id: number;

    /**
     * User's WCA id.
     * Null if the user never competed in a WCA competition
     *
     * @type {string}
     * @memberof UserEntity
     */
    @Column({ nullable: true, length: 10 })
    public wcaId: string;

    /**
     * User's name
     *
     * @type {string}
     * @memberof UserEntity
     */
    @Column({ nullable: false })
    public name: string;

    /**
     * Delegate status of the user
     * Null if the user is not a delegate
     *
     * @type {string}
     * @memberof UserEntity
     */
    @Column({ nullable: true })
    public delegateStatus: string;

    /**
     * Roles of the user in the teams of Cubing Italy
     * Null if the user has no roles
     *
     * @type {RoleEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => RoleEntity, role => role.user)
    public roles: RoleEntity[];

    /**
     * Articles published by the user
     *
     * @type {ArticleEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => ArticleEntity, article => article.author, { nullable: true })
    public createdArticles: ArticleEntity[];

    /**
     * Articles of  which the user is the last editor
     *
     * @type {ArticleEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => ArticleEntity, article => article.lastEditor, { nullable: true })
    public editedArticles: ArticleEntity[];

    /**
     * Pages whose creator is the user
     *
     * @type {SinglePageEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => SinglePageEntity, page => page.author, { nullable: true })
    public createdPages: SinglePageEntity[];

    /**
     * Pages whose last editor is the user
     *
     * @type {SinglePageEntity[]}
     * @memberof UserEntity
     */
    @OneToMany(type => SinglePageEntity, page => page.lastEditor, { nullable: true })
    public editedPages: SinglePageEntity[];


    /**
     * Takes a UserModel in input and copies its data
     *
     * @param {UserModel} origin
     * @memberof UserEntity
     */
    _assimilate(origin: UserModel): void {
        this.id = origin.id;
        this.wcaId = origin.wca_id;
        this.name = origin.name;
        this.delegateStatus = origin.delegate_satus;
        this.roles = origin.roles.map((role: RoleModel) => {
            let tmp: RoleEntity = new RoleEntity();
            tmp._assimilate(role);
            return tmp;
        });
    }

    /**
     * Returns a UserModel which is the copy of the current entity
     *
     * @returns {UserModel}
     * @memberof UserEntity
     */
    _transform(): UserModel {
        let user: UserModel = new UserModel();
        user.id = this.id;
        user.name = this.name;
        user.wca_id = this.wcaId;
        user.delegate_satus = this.delegateStatus;
        if (!this.checkIfRoleIsStupid() && this.roles !== undefined && this.roles !== null) {
            user.roles = this.roles.map((role: RoleEntity) => role._transform());
        }
        return user;
    }

    /**
     * This is a workaround because in case a user has no role, typeorm adds a completely null role in the roles array
     * If we don't check this, it'll make the conversion from Entity to Model crash
     *
     * @private
     * @returns {boolean}
     * @memberof UserEntity
     */
    private checkIfRoleIsStupid(): boolean {
        if (this.roles && this.roles.length == 1) {
            let role: RoleEntity = this.roles[0];
            if (role.isLeader === null && role.team === null && role.user === null) {
                return true;
            }
        }
        return false;
    }

}