import { Entity, PrimaryColumn, Column, BaseEntity, OneToMany, getConnection } from 'typeorm';
import { DB_TeamUser } from './db.team_user';
import { ITransformable } from '../transformable';
import { wca_user } from '../../models/wca_user.model';
import { ci_team } from '../../models/ci_team.model';
import { DB_Team } from './db.team';
import { keys } from '../../secrets/keys';

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

    static async getUserTeams(usr: DB_User): Promise<ci_team[]> {
        let tu_rel: DB_TeamUser[] = await DB_TeamUser.find({ user: usr });
        let teams: DB_Team[] = await DB_Team.find({ users: DB_TeamUser });
        let t_array: ci_team[] = teams.map(t => t._transform());
        return t_array;
    }

    static async updateUser(usr: DB_User) {
        return await DB_User.save(usr);
    }

    /**
     * Creates a user and checks whether it should set it as admin.
     * 
     * @static
     * @param {DB_User} usr 
     * @returns {Promise<boolean>} 
     * @memberof DB_User
     */
    static async createUser(usr: DB_User): Promise<boolean> {
        usr = await DB_User.save(usr);
        if (usr.id == keys.admin.id) {
            console.log("id is admin");
            return (await DB_User.setAdmin(usr)) !== null;
        }
        return false;
    }

    /**
     * Sets the user <usr> as admin.
     * 
     * @static
     * @param {DB_User} usr 
     * @returns {Promise<boolean>} 
     * @memberof DB_User
     */
    static async setAdmin(usr: DB_User): Promise<boolean> {
        console.log("giving permissions");
        let db_tu: DB_TeamUser = new DB_TeamUser();
        db_tu.user = usr;
        db_tu.team = await DB_Team.findOne({ shortname: keys.admin.shortname });
        db_tu.is_leader = true;
        console.log('db_tu.team is: ');
        console.log(db_tu.team);
        const res: DB_TeamUser = await DB_TeamUser.save(db_tu);
        return res !== null;
    }


    static async getIfExists(usr: DB_User): Promise<boolean> {
        let foundUser: DB_User = await DB_User.findOne({ id: usr.id });
        if (foundUser) {
            return true;
        }
        return false;
    }

    static async getModelUserById(id): Promise<wca_user> {
        let temp_usr: DB_User = await DB_User.findOneById(id);
        console.log("found");
        return temp_usr._transform();
    }


}