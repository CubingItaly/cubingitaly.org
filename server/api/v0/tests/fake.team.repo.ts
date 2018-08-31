import { TeamRepository } from "../../../db/repository/team.repository";
import { TeamEntity } from "../../../db/entity/team.entity";


export class FakeTeamRepo extends TeamRepository {

    private teamsList: { id: string, name: string, isPublic: boolean }[] = [
        { id: "admin", name: "Admin", isPublic: false },
        { id: "board", name: "Board", isPublic: true },
        { id: "citi", name: "CITI", isPublic: true },
        { id: "citq", name: "CITQ", isPublic: true },
        { id: "citc", name: "CITC", isPublic: true }
    ];

    private createTeam(id: string, name: string, isPublic: boolean): TeamEntity {
        let team: TeamEntity = new TeamEntity();
        team.id = id;
        team.name = name;
        team.isPublic = isPublic;
        return team;
    }


    public async getTeamById(id: string): Promise<TeamEntity> {
        if (!await this.checkIfTeamExistsById(id)) {
            return;
        }
        let tmp: { id: string, name: string, isPublic: boolean } = this.teamsList.find(t => t.id === id);
        let team: TeamEntity = new TeamEntity();
        team.id = tmp.id;
        team.name = tmp.name;
        team.isPublic = tmp.isPublic;
        return team;
    }

    public async checkIfTeamExistsById(id: string): Promise<boolean> {
        let index: number = this.teamsList.findIndex(t => t.id === id);
        return (index >= 0);
    }

    public async getTeams(): Promise<TeamEntity[]> {
        let teams: TeamEntity[] = [];
        this.teamsList.forEach(t => {
            teams.push(this.createTeam(t.id, t.name, t.isPublic));
        });
        return teams;
    }


    public async
}