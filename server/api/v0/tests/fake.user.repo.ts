import { UserRepository } from "../../../db/repository/user.repository";
import { UserEntity } from "../../../db/entity/user.entity";
import { RoleEntity } from "../../../db/entity/role.entity";
import { TeamEntity } from "../../../db/entity/team.entity";
import { UserModel } from "../../../models/classes/user.model";


export class FakeUserRepo extends UserRepository {

    private users: { id: number, name: string, wcaId: string, delegateStatus: string }[] = [
        { id: 1, name: "Test Name", delegateStatus: null, wcaId: null }, //normal user
        { id: 2, name: "Test Name", delegateStatus: null, wcaId: null }, //admin
        { id: 3, name: "Name Test", delegateStatus: null, wcaId: null }, //citi leader 
        { id: 4, name: "Name Test", delegateStatus: null, wcaId: null }, //citq leader
        { id: 5, name: "Name Test", delegateStatus: null, wcaId: null }, //citc leader
        { id: 6, name: "Name Test", delegateStatus: null, wcaId: null }, //citi member
        { id: 7, name: "Name Test", delegateStatus: null, wcaId: null }, // citq member
        { id: 8, name: "Name Test", delegateStatus: null, wcaId: null }, //citc member
        { id: 9, name: "Name Test", delegateStatus: "Delegate", wcaId: null },//board
        { id: 10, name: "Name Test", delegateStatus: "Candidate Delegate", wcaId: null }//board
    ];

    private teams: { id: string, name: string, isPublic: boolean }[] = [
        { id: "admin", name: "Admin", isPublic: false },
        { id: "board", name: "Board", isPublic: true },
        { id: "citi", name: "CITI", isPublic: true },
        { id: "citq", name: "CITQ", isPublic: true },
        { id: "citc", name: "CITC", isPublic: true }
    ];

    private createUser(id: number): UserEntity {
        let tmp: { id: number, name: string, wcaId: string, delegateStatus: string } = this.users.find(tmp => tmp.id == id);
        let user: UserEntity = new UserEntity();
        user.id = tmp.id;
        user.name = tmp.name;
        user.delegateStatus = tmp.delegateStatus;
        user.wcaId = tmp.wcaId;
        return user;
    }

    private addRole(user: UserEntity, role: RoleEntity): RoleEntity[] {
        if (user.roles === undefined) {
            user.roles = [];
        }
        user.roles.push(role);
        return user.roles;
    }

    private createTeam(id: string): TeamEntity {
        let tmp: { id: string, name: string, isPublic: boolean } = this.teams.find(t => t.id === id);
        let team: TeamEntity = new TeamEntity();
        team.id = tmp.id;
        team.name = tmp.name;
        team.isPublic = tmp.isPublic;
        return team;
    }

    private createRole(user: UserEntity, team: TeamEntity, isLeader: boolean): RoleEntity {
        let role: RoleEntity = new RoleEntity();
        role.isLeader = isLeader;
        role.team = team;
        role.user = user;
        return role;
    }



    public async getUserById(id: number): Promise<UserEntity> {
        if (id < 0 || id > this.users.length) {
            return;
        }
        let user: UserEntity = this.createUser(id);
        let role: RoleEntity;
        let team: TeamEntity;
        switch (id) {
            case 2:
                team = this.createTeam("admin");
                role = this.createRole(user, team, false);
                user.roles = this.addRole(user, role);
                break;
            case 3:
                team = this.createTeam("citi");
                role = this.createRole(user, team, true);
                user.roles = this.addRole(user, role);
                break;
            case 4:
                team = this.createTeam("citq");
                role = this.createRole(user, team, true);
                user.roles = this.addRole(user, role);
                break;
            case 5:
                team = this.createTeam("citc");
                role = this.createRole(user, team, true);
                user.roles = this.addRole(user, role);
                break;
            case 6:
                team = this.createTeam("citi");
                role = this.createRole(user, team, false);
                user.roles = this.addRole(user, role);
                break;
            case 7:
                team = this.createTeam("citq");
                role = this.createRole(user, team, false);
                user.roles = this.addRole(user, role);
                break;
            case 8:
                team = this.createTeam("citc");
                role = this.createRole(user, team, false);
                user.roles = this.addRole(user, role);
                break;
            case 9:
                team = this.createTeam("board");
                role = this.createRole(user, team, false);
                user.roles = this.addRole(user, role);
                break;
            case 10:
                team = this.createTeam("board");
                role = this.createRole(user, team, false);
                user.roles = this.addRole(user, role);
                break;
        }
        return user;
    }


    public async getShortUserById(id: number): Promise<UserEntity> {
        if (id <= this.users.length && id > 0) {
            return this.createUser(id);
        }
        return;
    }


    public async checkIfUserExists(id: number): Promise<boolean> {
        if (id > 0 && id <= this.users.length) {
            return true;
        }
        return false;
    }


    public async updateUser(user: UserEntity): Promise<UserEntity> {
        return user;
    }


    public async findUsersByName(name: string): Promise<UserEntity[]> {
        if (name.startsWith("t")) {
            let result: UserEntity[] = [await this.getShortUserById(1), await this.getShortUserById(2)];
            return result;
        } else if (name === "") {
            let result: UserEntity[] = [];
            for (let i = 1; i <= this.users.length; i++) {
                result.push(await this.getShortUserById(i));
            }
            return result;
        }
        return [];
    }


    public async findUsersByTeam(team: TeamEntity): Promise<UserEntity[]> {
        if (team.id === "citi") {
            return [await this.getShortUserById(3), await this.getShortUserById(6)];
        }
        return [];
    }
}



