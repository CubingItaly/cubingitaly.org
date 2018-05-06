import { Entity, PrimaryColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { ITransformable } from '../transformable';
import { CITeam } from '../../models/ci.team.model';
import { DBUser } from './db.user';
import { DBRole } from './db.role';
import { CIMember } from '../../models/ci.member.model';


/**
 * Database entitity used to represents teams
 * 
 * @export
 * @class DBTeam
 * @extends {BaseEntity}
 * @implements {ITransformable<CITeam>}
 */
@Entity()
export class DBTeam extends BaseEntity implements ITransformable<CITeam> {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(type => DBRole, member => member.team)
    members: DBRole[] = [];

    /**
     * Loads params from a CITeam 
     * 
     * @param {CITeam} team 
     * @memberof DBTeam
     */
    _assimilate(team: CITeam) {
        this.id = team.id;
        this.name = team.name;
    }


    /**
     * Genereates a CITeam from the current user
     * 
     * @returns {CITeam} 
     * @memberof DBTeam
     */
    _transform(): CITeam {
        let tmp_team = new CITeam();
        tmp_team.id = this.id;
        tmp_team.name = this.name;
        this.members.map(m => {
            let tmp_member = new CIMember();
            tmp_member.leader = m.leader;
            tmp_member.id = m.member.id;
        })
        return tmp_team;
    }


}
