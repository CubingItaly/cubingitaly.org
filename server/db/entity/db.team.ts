import { Entity, PrimaryColumn, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { DB_TeamUser } from './db.team_user';

@Entity()
export class DB_Team extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({length:5})
    shortname: string;

    @OneToMany(type => DB_TeamUser, user => user.team)
    users: DB_TeamUser[]
}