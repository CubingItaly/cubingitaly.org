import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { TeamEntity } from "../entity/team.entity";

/**
 *
 *
 * @export
 * @class Repository
 * @extends {BaseCommonRepository<TeamEntity>}
 */
@EntityRepository(TeamEntity)
export class TeamRepository extends BaseCommonRepository<TeamEntity> {



    private teams: { id: string, name: string, isPublic: boolean }[] = [{
        id: "admin",
        name: "Admin",
        isPublic: false
    }, {
        id: "board",
        name: "Cubing Italy Board",
        isPublic: true
    }, {
        id: "citc",
        name: "Cubing Italy Team Comunicazione",
        isPublic: true
    }, {
        id: "citi",
        name: "Cubing Italy Team Informatico",
        isPublic: true
    },
    {
        id: "citq",
        name: "Cubing Italy Team Qualità",
        isPublic: true
    }];

    /**
     *
     *
     * @type {string}
     * @memberof Repository
     */
    public _entityIdentifier: string = "TeamEntity";


    /**
     *
     *
     * @returns {Promise<void>}
     * @memberof Repository
     */
    public async InitDefaults(): Promise<void> {
        let exist: boolean = false;
        let team: TeamEntity = new TeamEntity;

        for (const t of this.teams) {
            exist = await this.checkIfTeamExistsById(t.id);
            if (!exist) {
                team.id = t.id;
                team.name = t.name;
                team.isPublic = t.isPublic;
                await this.repository.save(team);
            }
        }
        return;
    }


    public async checkIfTeamExists(team: TeamEntity): Promise<boolean> {
        return this.checkIfTeamExistsById(team.id);
    }

    public async checkIfTeamExistsById(id: string): Promise<boolean> {
        let result: TeamEntity = await this.repository.findOne(id);
        return (result !== undefined && result !== null);
    }

    public async getTeamById(id: string): Promise<TeamEntity> {
        return await this.repository.findOne(id);
    }

    public async getTeams(): Promise<TeamEntity[]> {
        let teams: TeamEntity[] = await this.repository.find();
        return teams;
    }

}