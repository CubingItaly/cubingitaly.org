import { Entity, BaseEntity, Column, ManyToOne, JoinTable } from "typeorm";
import { ITransformable } from "../transformable";
import { RoleModel } from "../../models/classes/role.model";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";
import { getUserRepository } from "../../shared/repository.utils";

@Entity()
export class RoleEntity extends BaseEntity implements ITransformable<RoleModel>{

    @Column({ nullable: false })
    public isLeader: boolean;

    @ManyToOne(type => UserEntity, user => user.roles, { nullable: false, primary: true })
    @JoinTable()
    public user: UserEntity;

    @ManyToOne(type => TeamEntity, team => team.roles, { nullable: false, primary: true })
    @JoinTable()
    public team: TeamEntity;


    _assimilate(origin: RoleModel): void {
        this.isLeader = origin.isLeader;
    }

    _transform(): RoleModel {
        let role: RoleModel = new RoleModel();
        role.isLeader = this.isLeader;
        role.team = this.team.id;
        role.user = this.user.id;
        return role
    }
}