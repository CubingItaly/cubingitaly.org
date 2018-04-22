import { Entity, PrimaryColumn, Column, BaseEntity, OneToOne, ManyToOne } from 'typeorm';
import { DB_User } from './db.user';
import { DB_Team } from './db.team';

@Entity()
export class DB_TeamUser extends BaseEntity {

    @Column()
    is_leader: boolean

    @ManyToOne(type => DB_User, user => user.teams, { nullable: false, primary: true })
    user: DB_User

    @ManyToOne(type => DB_Team, team => team.users, { nullable: false, primary: true })
    team: DB_Team

}   