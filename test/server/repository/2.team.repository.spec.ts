import { assert } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';
import { TeamRepository } from '../../../server/db/repository/team.repository';
import { getCustomRepository } from 'typeorm';
import { TeamEntity } from '../../../server/db/entity/team.entity';

let database: TestDatabase;
let repo: TeamRepository;

describe('Test the team repo', () => {
    before(async () => {
        database = new TestDatabase();
        await database.createConnection();
        repo = getCustomRepository(TeamRepository);
    });

    it('test if a team exist by id', async () => {
        let exist: boolean = await repo.checkIfTeamExistsById('admin');
        assert.equal(exist, true);
        exist = await repo.checkIfTeamExistsById('asdaj');
        assert.equal(exist, false);
    });

    it('test if a team exist', async () => {
        let team: TeamEntity = new TeamEntity();
        team.id = "admin";
        team.name = "Admin";
        team.isPublic = false;
        let exist: boolean = await repo.checkIfTeamExists(team);
        assert.equal(exist, true);
        team.id = "aslkkjdasl";
        exist = await repo.checkIfTeamExists(team);
        assert.equal(exist, false);
    });

    it('test a method to get a team', async () => {
        let team: TeamEntity = await repo.getTeamById('admin');
        assert.equal(team.id, "admin");
        team = await repo.getTeamById("aklkjas");
        assert.equal(team, undefined);
    });

    it('test the method to get teams and init', async () => {
        let teams: TeamEntity[] = await repo.getTeams();
        assert.equal(teams.length, 5);

        await repo.InitDefaults();

        teams = await repo.getTeams();
        assert.equal(teams.length, 5);
    });


    after(async () => {
        await database.closeConnection();
    })
})


