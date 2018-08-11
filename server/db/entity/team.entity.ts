import { ITransformable } from "../transformable";
import { TeamModel } from "../../models/classes/team.model";
import { BaseEntity, PrimaryColumn, Column, Entity, OneToMany } from "typeorm";
import { RoleEntity } from "./role.entity";

/**
 * The database entity that represents the teams of Cubing Italy
 *
 * @export
 * @class TeamEntity
 * @extends {BaseEntity}
 * @implements {ITransformable<TeamModel>}
 */
@Entity()
export class TeamEntity extends BaseEntity implements ITransformable<TeamModel> {

    /**
     * The team's id
     *
     * @type {string}
     * @memberof TeamEntity
     */
    @PrimaryColumn({ length: 5 })
    public id: string;


    /**
     * The team's name
     *
     * @type {string}
     * @memberof TeamEntity
     */
    @Column({ nullable: false, length: 35 })
    public name: string;

    @OneToMany(type => RoleEntity, role => role.team, { nullable: true })
    public roles: RoleEntity[];


    /**
     * Takes a TeamModel in input and copies its data
     *
     * @param {TeamModel} origin
     * @memberof TeamEntity
     */
    _assimilate(origin: TeamModel): void {
        this.id = origin.id;
        this.name = origin.name;
    }


    /**
     * Returns a TeamModel which is the copy of the current entity
     *
     * @returns {TeamModel}
     * @memberof TeamEntity
     */
    _transform(): TeamModel {
        let team: TeamModel = new TeamModel();
        team.id = this.id;
        team.name = this.name;
        return team;
    }
}