import { Entity, PrimaryColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { ITransformable } from '../transformable';
import { DBTeam } from './db.team';
import { keys } from '../../secrets/keys';
import { CIUser } from '../../models/ci.user.model';
import { DBRole } from './db.role';
import { CIRole } from '../../models/ci.roles.model';
import { DBArticle } from './db.article';


/**
 * Database entity used to represent users
 * 
 * @export
 * @class DBUser
 * @extends {BaseEntity}
 * @implements {ITransformable<CIUser>}
 */
@Entity()
export class DBUser extends BaseEntity implements ITransformable<CIUser> {

    @PrimaryColumn()
    id: number;

    @Column({ nullable: true })
    wca_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    delegate_status: string;

    @OneToMany(type => DBRole, role => role.member)
    roles: DBRole[];

    @OneToMany(type => DBArticle, article => article.author)
    articles: DBArticle[];

    /**
     * Loads params from a CIUser
     * 
     * @param {CIUser} user 
     * @memberof DBUser
     */
    _assimilate(user: CIUser) {
        this.id = user.id;
        this.wca_id = user.wca_id;
        this.name = user.name;
        this.delegate_status = user.delegate_status;
    }

    /**
     * Generates a CIUser from the current entity
     * 
     * @returns {CIUser} 
     * @memberof DBUser
     */
    _transform(): CIUser {
        let ci_user = new CIUser();
        ci_user.id = this.id;
        ci_user.wca_id = this.wca_id;
        ci_user.name = this.name;
        ci_user.delegate_status = this.delegate_status;
        if (this.roles) {
            ci_user.roles = [];
            this.roles.map(r => {
                let tmp_role = new CIRole();
                tmp_role.team = r.team.id;
                tmp_role.leader = r.leader;
                ci_user.roles.push(tmp_role)
            });
        }

        return ci_user;
    }

}