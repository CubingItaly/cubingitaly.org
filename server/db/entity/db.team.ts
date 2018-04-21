import { Entity, PrimaryColumn, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { TeamUser } from './db.team_user';

@Entity()
export class Team extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({length:5})
    shortname: string;

    @OneToMany(type => TeamUser, user => user.team)
    users: TeamUser[]
}