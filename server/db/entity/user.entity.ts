import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { ITransformable } from "../transformable";
import { UserModel } from "../../models/classes/user.model";
import { RoleEntity } from "./role.entity";
import { RoleModel } from "../../models/classes/role.model";
import { getRoleEntity } from "../../shared/repository.utils";




@Entity()
export class UserEntity extends BaseEntity implements ITransformable<UserModel>{

    @PrimaryColumn()
    public id: number;

    @Column({ nullable: true, length: 10 })
    public wcaId: string;

    @Column({ nullable: false })
    public name: string;

    @Column({ nullable: true })
    public delegateStatus: string;

    @OneToMany(type => RoleEntity, role => role.user, { nullable: true })
    public roles: RoleEntity[];



    _assimilate(origin: UserModel): void {
        this.id = origin.id;
        this.wcaId = origin.wca_id;
        this.name = origin.name;
        this.delegateStatus = origin.delegate_satus;
        //this.roles = origin.roles.map((role: RoleModel) => getRoleEntity(role));
    }

    _transform(): UserModel {
        let user: UserModel = new UserModel();
        user.id = this.id;
        user.name = this.name;
        user.wca_id = this.wcaId;
        user.delegate_satus = this.delegateStatus;
        if (this.roles !== undefined && this.roles !== null) {
            user.roles = this.roles.map((role: RoleEntity) => role._transform());
        }
        return user;
    }

}