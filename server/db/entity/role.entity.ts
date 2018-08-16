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
    @ManyToOne(type => UserEntity, user => user.roles, { nullable: false, primary: true })
    public user: UserEntity;

    /**
     * The team associated with the role.
     *
     * @type {TeamEntity}
     * @memberof RoleEntity
     */
    @ManyToOne(type => TeamEntity, team => team.roles, { nullable: false, primary: true })
    public team: TeamEntity;

    /**
     * Convert a RoleModel into a role entity.
     *
     * @param {RoleModel} origin
     * @returns {Promise<void>}
     * @memberof RoleEntity
     */
    async _assimilate(origin: RoleModel): Promise<void> {
        this.isLeader = origin.isLeader;
        const userRepo: UserRepository = getCustomRepository(UserRepository);
        this.user = await userRepo.getShortUserById(origin.user);
        const teamRepo: TeamRepository = getCustomRepository(TeamRepository);
        this.team = await teamRepo.getTeamById(origin.team);
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