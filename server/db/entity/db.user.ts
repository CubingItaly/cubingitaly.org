import { Entity, PrimaryColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { DB_TeamUser } from './db.team_user';
import { ITransformable } from '../transformable';
import { wca_user } from '../../models/wca_user.model';

@Entity()
export class DB_User extends BaseEntity implements ITransformable<wca_user> {

    /**
     * This is the wca generated id
     */
    @PrimaryColumn()
    id: number;

    @Column({ nullable: true })
    wcaid: string;

    @Column()
    name: string;

    @Column()
    email: string;

    /**
     * Can be either "delegate", "candidate_delegate" or null
     */
    @Column({ nullable: true })
    delegate_status: string;

    @OneToMany(type => DB_TeamUser, team => team.user)
    teams: DB_TeamUser[]


    /**
     * Assimilates an existing wca_user instance.
     * 
     * @param {wca_user} origin 
     */
    _assimilate(origin: wca_user): void {
        this.id = origin.id;
        this.wcaid = origin.wca_id;
        this.name = origin.name;
        this.email = origin.email;
        this.delegate_status = origin.delegate_status;
    }

    /**
     * Generates a new instance of {wca_user} and returns it
     */
    _transform(): wca_user {
        let w_usr = new wca_user();
        w_usr.id = this.id;
        w_usr.wca_id = this.wcaid;
        w_usr.email = this.email;
        w_usr.name = this.name;
        w_usr.delegate_status = this.delegate_status;
        return w_usr;
    }

}