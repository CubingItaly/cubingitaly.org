import 'mocha';
import { assert, expect } from 'chai';
import { Database } from '../database';
import { MysqlTool } from './mysql.tool';
import { TeamRepository } from '../repository/team.repository';
import { getCustomRepository } from 'typeorm';
import { TeamEntity } from '../entity/team.entity';


let database: Database;
let dbTool: MysqlTool;
let teamRepo: TeamRepository;


describe('Test the Team Repository', () => {
    before(async () => {
        dbTool = new MysqlTool();
        await dbTool.prepareDatabaseToTest();
        database = new Database();
        await database.createConnection();
        await database.initDatabase();
        teamRepo = getCustomRepository(TeamRepository);
    });

    after(async () => {
        await database.closeConnection();
        await dbTool.restoreDatabaseAfterTest();
    });

    it('Test the checkIfExistsById method', async () => {
        let exist: boolean = await teamRepo.checkIfTeamExistsById("citi");
        assert.equal(exist, true);

        exist = await teamRepo.checkIfTeamExistsById("aijsa");
        assert.equal(exist, false);

        exist = await teamRepo.checkIfTeamExistsById("");
        assert.equal(exist, false);
    });


    it('Test the checkIfExists method', async () => {
        let team: TeamEntity = new TeamEntity();
        team.id = "citi";
        team.name = "Cubing Italy Team Informatico";
        team.isPublic = true;

        let exist: boolean = await teamRepo.checkIfTeamExists(team);
        assert.equal(exist, true);

        team.id = "klskajslaj";
        exist = await teamRepo.checkIfTeamExists(team);
        assert.equal(exist, false);

        team.id = "";
        exist = await teamRepo.checkIfTeamExists(team);
        assert.equal(exist, false);
    });

    it('Test the method to get a team by ID', async () => {
        let team: TeamEntity = await teamRepo.getTeamById("citi");
        assert.equal(team.id, "citi");
        assert.equal(team.isPublic, true);
        assert.equal(team.name, "Cubing Italy Team Informatico");
    });


    it('Test the method to get all the teams', async () => {
        let teams: TeamEntity[] = await teamRepo.getTeams();
        assert.equal(teams.length, 5);
        expect(teams.findIndex(t => t.id === "citi")).to.greaterThan(-1);
        expect(teams.findIndex(t => t.id === "citq")).to.greaterThan(-1);
        expect(teams.findIndex(t => t.id === "citc")).to.greaterThan(-1);
        expect(teams.findIndex(t => t.id === "admin")).to.greaterThan(-1);
        expect(teams.findIndex(t => t.id === "board")).to.greaterThan(-1);
    });

    it('Test the init method', async () => {
        await teamRepo.InitDefaults();
        let teams: TeamEntity[] = await teamRepo.getTeams();
        assert.equal(teams.length, 5);
    });

});