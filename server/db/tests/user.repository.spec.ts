import 'mocha';
import * as sinon from 'sinon';
import { assert, expect } from 'chai';
import { Database } from '../database';
import { MysqlTool } from './mysql.tool';
import { UserRepository } from '../repository/user.repository';
import { getCustomRepository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { TeamRepository } from '../repository/team.repository';
import { TeamEntity } from '../entity/team.entity';

let database: Database;
let dbTool: MysqlTool;
let userRepo: UserRepository


describe('Test the user repository', () => {

    function compareUser(first: UserEntity, second: UserEntity): boolean {
        let result: boolean = true;
        result = (first.id === second.id) ? result : false;
        result = (first.name === second.name) ? result : false;
        result = (first.wcaId == second.wcaId) ? result : false;
        result = (first.delegateStatus == second.delegateStatus) ? result : false;
        return result;
    }

    before(async () => {
        dbTool = new MysqlTool();
        await dbTool.prepareDatabaseToTest();
        database = new Database();
        await database.createConnection();
        await database.initDatabase();
        userRepo = getCustomRepository(UserRepository);
    });

    after(async () => {
        await database.closeConnection();
        await dbTool.restoreDatabaseAfterTest();
    });

    it('Test the login of a new user', async () => {

        let user: UserEntity = new UserEntity();
        user.id = 1;
        user.name = "Test User";
        user.wcaId = null;
        user.delegateStatus = null;

        let result: UserEntity = await userRepo.updateUser(user);
        let compare: boolean = compareUser(user, result);
        assert.equal(compare, true);

    });

    it('Test function to check if user exist', async () => {

        let exist: boolean = await userRepo.checkIfUserExists(1);
        assert.equal(exist, true);

        exist = await userRepo.checkIfUserExists(29292);
        assert.equal(exist, false);
    });

    it('Test function get user by id', async () => {
        let user: UserEntity = await userRepo.getUserById(1);

        assert.equal(user.id, 1);
        //assert.equal(user.roles.length, 0);

        user = await userRepo.getUserById(33422);
        assert.equal(user, undefined);
    });

    it('Test function get short user by id', async () => {
        let user: UserEntity = await userRepo.getShortUserById(1);

        assert.equal(user.id, 1);
        assert.equal(user.roles, undefined);

        user = await userRepo.getUserById(2320);
        assert.equal(user, undefined);
    });


    it('Test the function to search user by name', async () => {
        let result: UserEntity[] = await userRepo.findUsersByName("t");
        assert.equal(result.length, 1);

        result = await userRepo.findUsersByName("k");
        assert.equal(result.length, 0);
    });

    it('Test the function to search users by team', async () => {
        let teamRepo: TeamRepository = getCustomRepository(TeamRepository);
        let team: TeamEntity = await teamRepo.getTeamById("citi");
        let result: UserEntity[] = await userRepo.findUsersByTeam(team);

        assert.equal(result.length, 0);
    });
});