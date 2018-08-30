import { UserRepository } from "../../../db/repository/user.repository";
import { UserEntity } from "../../../db/entity/user.entity";
import { RoleEntity } from "../../../db/entity/role.entity";
import { TeamEntity } from "../../../db/entity/team.entity";
import { UserModel } from "../../../models/classes/user.model";


export class FakeUserRepo extends UserRepository {

    private users: { id: number, name: string, wcaId: string, delegateStatus: string }[] = [
        { id: 1, name: "Test Name", delegateStatus: null, wcaId: null },
        { id: 2, name: "Test Name", delegateStatus: null, wcaId: null },
        { id: 3, name: "Test Name", delegateStatus: null, wcaId: null },
        { id: 4, name: "Test Name", delegateStatus: null, wcaId: null }
    ];

    private teams: { id: string, name: string, isPublic: boolean }[] = [
        { id: "admin", name: "Admin", isPublic: false },
        { id: "board", name: "Board", isPublic: true },
        { id: "citi", name: "CITI", isPublic: true },
        { id: "citq", name: "CITQ", isPublic: true },
        { id: "citc", name: "CITC", isPublic: true }
    ];

    private createUser(id: number): UserEntity {
        let tmp: { id: number, name: string, wcaId: string, delegateStatus: string } = this.users.find(tmp => tmp.id === id);
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

    private createTeam(id: string, name: string, isPublic: boolean): TeamEntity {
        let team: TeamEntity = new TeamEntity();
        team.id = id;
        team.name = name;
        team.isPublic = isPublic;
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
        let user: UserEntity;
        switch (id) {
            case 1:
                user = this.createUser(1);
                return user;
            case 2:
                user = this.createUser(2);

                let team: TeamEntity = this.createTeam("citi", "Team Info", true);
                let role: RoleEntity = this.createRole(user, team, true);
                user.roles = this.addRole(user, role);

                return user;
            default:
                return;

        }
    }


    public async getShortUserById(id: number): Promise<UserEntity> {
        let user: UserEntity = new UserEntity();
        switch (id) {
            case 1:
                user.id = 1;
                user.name = "Test Name";
                return user;
            case 2:
                user.id = 2;
                user.name = "Test Name";
                return user;
            default:
                return;

        }
    }


    public async checkIfUserExists(id: number): Promise<boolean> {
        switch (id) {
            case 1:
                return true;
            case 2:
                return true;
            default:
                return false;
        }
    }


    public async updateUser(user: UserEntity): Promise<UserEntity> {
        return user;
    }


    public async findUsersByName(name: string): Promise<UserEntity[]> {
        if (name.startsWith("t") || name === "") {
            let result: UserEntity[] = [await this.getShortUserById(1), await this.getShortUserById(2)];
            return result;
        }
        return [];
    }


    public async findUsersByTeam(team: TeamEntity): Promise<UserEntity[]> {
        if (team.id === "citi") {
            return [await this.getShortUserById(2)];
        }
        return [];
    }
}



