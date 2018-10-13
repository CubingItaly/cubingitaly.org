import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { TeamEntity } from "../entity/team.entity";



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
     * Init the teams table in the database.
     * If the default teams do not exist, they are added.
     *
     * @returns {Promise<void>}
     * @memberof TeamRepository
     */
    public async InitDefaults(): Promise<void> {
        let exist: boolean = false;
        let team: TeamEntity = new TeamEntity();

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

    /**
     * Check if a team exist, return true if so.
     * Only the id of the team is compared.
     *
     * @param {TeamEntity} team
     * @returns {Promise<boolean>}
     * @memberof TeamRepository
     */
    public async checkIfTeamExists(team: TeamEntity): Promise<boolean> {
        return this.checkIfTeamExistsById(team.id);
    }

    /**
     * Check if a team exist after searching hit by id.
     * Return true if the team exists.
     * 
     * @param {string} id
     * @returns {Promise<boolean>}
     * @memberof TeamRepository
     */
    public async checkIfTeamExistsById(id: string): Promise<boolean> {
        let count: number= await this.repository.count({where: {id:id}});
        return count > 0;
    }

    /**
     * Return a single team, if the team is not found returns null
     *
     * @param {string} id
     * @returns {Promise<TeamEntity>}
     * @memberof TeamRepository
     */
    public async getTeamById(id: string): Promise<TeamEntity> {
        return this.repository.findOne(id);
    }

    /**
     * Return the list of the teams in the database
     *
     * @returns {Promise<TeamEntity[]>}
     * @memberof TeamRepository
     */
    public async getTeams(): Promise<TeamEntity[]> {
        return this.repository.find();
    }

}