import { Entity, PrimaryColumn, Column, BaseEntity, OneToOne, ManyToOne } from 'typeorm';
import { User } from './db.user';
import { Team } from './db.team';

@Entity()
export class TeamUser extends BaseEntity {

    @Column()
    is_leader: boolean

    @ManyToOne(type => User, user => user.teams, { nullable: false, primary: true })
    user: User

    @ManyToOne(type => Team, team => team.users, { nullable: false, primary: true })
    team: Team

}   