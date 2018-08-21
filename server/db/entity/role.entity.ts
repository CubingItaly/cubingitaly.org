import { Entity, BaseEntity, Column, ManyToOne, JoinTable, getCustomRepository } from "typeorm";
import { ITransformable } from "../transformable";
import { RoleModel } from "../../models/classes/role.model";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";
import { UserRepository } from "../repository/user.repository";
import { TeamRepository } from "../repository/team.repository";

@Entity()
export class RoleEntity extends BaseEntity implements ITransformable<RoleModel>{

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
     * #WARNING: Do not use this method
     * Convert a RoleModel into a role entity.
     *
     * @param {RoleModel} origin
     * @returns {Promise<void>}
     * @memberof RoleEntity
     */
    async _assimilate(origin: RoleModel): Promise<void> {
        //# WARN: Do not use this method
    }

    /**
     * Transforms the current entity an returns a Role Model.
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