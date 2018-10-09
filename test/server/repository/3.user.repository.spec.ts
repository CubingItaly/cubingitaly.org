import { assert } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';
import { UserRepository } from '../../../server/db/repository/user.repository';
import { getCustomRepository } from 'typeorm';
import { UserEntity } from '../../../server/db/entity/user.entity';
import { TeamRepository } from '../../../server/db/repository/team.repository';
import { TeamEntity } from '../../../server/db/entity/team.entity';
let database: TestDatabase;
let repo: UserRepository;


describe('Test the user repo', () => {


    before(async () => {
        database = new TestDatabase();
        await database.createConnection();
        repo = getCustomRepository(UserRepository);
        await repo.InitDefaults();
    });

    it('test the method to get the default user', async () => {
        let user: UserEntity = await repo.getUserById(0);
        assert.equal(user.id, 0);
        assert.equal(user.name, "Cubing Italy");
        assert.equal(user.wcaId, undefined);
        assert.equal(user.delegateStatus, null);
        assert.equal(user.roles.length, 0);
    });

    it('test the method to get the short default user', async () => {
        let user: UserEntity = await repo.getShortUserById(0);
        assert.equal(user.id, 0);
        assert.equal(user.name, "Cubing Italy");
        assert.equal(user.wcaId, undefined);
        assert.equal(user.delegateStatus, null);
        assert.equal(user.roles, undefined);
    });

    it('test the method to update an user who is admin', async () => {
        let user: UserEntity = new UserEntity();
        user.id = 397;
        user.name = "TEst";
        user = await repo.updateUser(user);
        assert.equal(user.id, 397);
        assert.equal(user.roles.length, 1);
    });

    it('Test the method to get a user', async () => {
        let user: UserEntity = await repo.getUserById(397);
        assert.equal(user.id, 397);
        assert.equal(user.name, "TEst");
        assert.equal(user.wcaId, undefined);
        assert.equal(user.delegateStatus, null);
        assert.equal(user.roles.length, 1);
        assert.equal(user.roles[0].isLeader, false);
        assert.equal(user.roles[0].user.id, 397);
        assert.equal(user.roles[0].team.id, "admin");
    });

    it('Test the method to get a short user', async () => {
        let user: UserEntity = await repo.getShortUserById(397);
        assert.equal(user.roles, undefined);
    });


    it('Test the method to update a user who already exists', async () => {
        let user: UserEntity = new UserEntity();
        user.id = 0;
        user.name = "Cubing Italo";
        user = await repo.updateUser(user);
        assert.equal(user.id, 0);
        assert.equal(user.name, "Cubing Italo");
    });

    it('Test the method to find a user by name', async () => {
        let users: UserEntity[] = await repo.findUsersByName("T");
        assert.equal(users.length, 1);
        assert.equal(users[0].id, 397);
        users = await repo.findUsersByName("Tx");
        assert.equal(users.length, 0);
    });

    it('Test the method to get users by team', async () => {
        let teamRepo: TeamRepository = getCustomRepository(TeamRepository);
        let team: TeamEntity = await teamRepo.getTeamById("admin");
        let users: UserEntity[] = await repo.findUsersByTeam(team);
        assert.equal(users.length, 1);
        assert.equal(users[0].id, 397);
        team = await teamRepo.getTeamById("citq");
        users = await repo.findUsersByTeam(team);
        assert.equal(users.length, 0);
    });


    after(async () => {
        await database.closeConnection();
    })
})


