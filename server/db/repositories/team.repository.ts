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
        if(exist){
            let result: TeamEntity = await this.repository.findOne(id);
            return result;
        }
        return;
    }

    public async addTeam(team: TeamEntity): Promise<boolean> {
        return;
    }

    public async getTeams(): Promise<TeamEntity[]> {
        let teams: TeamEntity[] = await this.repository.find();
        return teams;
    }

}