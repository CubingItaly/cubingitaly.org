import { Entity, PrimaryColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { DBUser } from './db.user';
import { DBTeam } from './db.team';

/**
 * Entity used to manage the relationship between users and teams
 * 
 * @export
 * @class DBRole
 * @extends {BaseEntity}
 */
@Entity()
export class DBRole extends BaseEntity {

    @Column()
    leader: boolean;

    @ManyToOne(type => DBUser, user => user.roles, { primary: true, nullable: false })
    member: DBUser

    @ManyToOne(type => DBTeam, team => team.members, { primary: true, nullable: false })
    team: DBTeam

}
