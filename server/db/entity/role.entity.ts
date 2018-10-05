import { Entity, BaseEntity, Column, ManyToOne, JoinTable, getCustomRepository } from "typeorm";
import { RoleModel } from "../../models/classes/role.model";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";

/**
 * Database entity that represents a Role of a User in a Team of Cubing italy
 *
 * @export
 * @class RoleEntity
 * @extends {BaseEntity}
 */
@Entity()
export class RoleEntity extends BaseEntity {

    /**
     * Whether the user involved in the role is leader of the team or not.
     * True if the user is leader.
     *
     * @type {boolean}
     * @memberof RoleEntity
     */
    @Column({ nullable: false })
    public isLeader: boolean;

    /**
     * The user involved in the role.
     *
     * @type {UserEntity}
     * @memberof RoleEntity
     */
    @ManyToOne(type => UserEntity, user => user.roles, { primary: true })
    public user: UserEntity;

    /**
     * The team associated with the role.
     *
     * @type {TeamEntity}
     * @memberof RoleEntity
     */
    @ManyToOne(type => TeamEntity, team => team.roles, { primary: true })
    public team: TeamEntity;

    /**
     * Transforms the current entity and returns a Role Model.
     *
     * @returns {RoleModel}
     * @memberof RoleEntity
     */
    _transform(): RoleModel {
        let role: RoleModel = new RoleModel();
        role.isLeader = this.isLeader;
        role.team = this.team.id;
        role.user = this.user.id;
        return role;
    }
}