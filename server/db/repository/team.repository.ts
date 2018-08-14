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
    private teamIds: string[] = ["admin", "board", "citc", "citi", "citq"];
    private teamNames: string[] = ["Admin", "Cubing Italy Board", "Cubing Italy Team Comunicazione", "Cubing Italy Team Informatico", "Cubing Italy Team Qualità"];
    private publicStatus: boolean[] = [false, true, true, true, true];

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
        for (let i = 0; i < this.teamIds.length; i++) {
            exist = await this.checkIfTeamExistsById(this.teamIds[i]);
            if (!exist) {
                team.id = this.teamIds[i];
                team.name = this.teamNames[i]
                team.isPublic = this.publicStatus[i];
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
        let exist: boolean = await this.checkIfTeamExistsById(id);
        if (exist) {
            let result: TeamEntity = await this.repository.findOne(id);
            return result;
        }
        return;
    }

    public async getTeams(): Promise<TeamEntity[]> {
        let teams: TeamEntity[] = await this.repository.find();
        return teams;
    }

}