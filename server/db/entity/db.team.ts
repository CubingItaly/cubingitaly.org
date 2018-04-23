import { Entity, PrimaryColumn, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DB_TeamUser } from './db.team_user';
import { ITransformable } from '../transformable';
import { ci_team } from '../../models/ci_team.model';

@Entity()
export class DB_Team extends BaseEntity implements ITransformable<ci_team> {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ length: 5 })
    shortname: string;

    @OneToMany(type => DB_TeamUser, user => user.team)
    users: DB_TeamUser[]

    /**
     * Assimilates an existing wca_user instance.
     * 
     * @param {ci_team} origin 
     */
    _assimilate(origin: ci_team): void {
        this.id = origin.id;
        this.name = origin.name;
        this.shortname = origin.shortname;
    }

    /**
     * Generates a new instance of {wca_user} and returns it
     */
    _transform(): ci_team {
        let c_team = new ci_team();
        c_team.id = this.id;
        c_team.name = this.name;
        c_team.shortname = this.shortname;

        return c_team;

    }
}
