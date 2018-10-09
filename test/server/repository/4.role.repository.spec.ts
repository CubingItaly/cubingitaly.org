import { assert } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';
import { RoleRepository } from '../../../server/db/repository/role.repository';
import { getCustomRepository } from 'typeorm';
import { RoleEntity } from 'server/db/entity/role.entity';
import { UserEntity } from '../../../server/db/entity/user.entity';
import { TeamEntity } from '../../../server/db/entity/team.entity';
import { UserRepository } from '../../../server/db/repository/user.repository';
import { TeamRepository } from '../../../server/db/repository/team.repository';

let database: TestDatabase;
let repo: RoleRepository;
let userRepo: UserRepository;
let teamRepo: TeamRepository;
let user: UserEntity;
let team: TeamEntity;

describe('Test the role repo', () => {

    before(async () => {
        database = new TestDatabase();
        await database.createConnection();
        repo = getCustomRepository(RoleRepository);
        userRepo = getCustomRepository(UserRepository);
        teamRepo = getCustomRepository(TeamRepository);

        user = await userRepo.getUserById(0);
    });

    it('adds a role', async () => {
        team = await teamRepo.getTeamById("citq");
        let role: RoleEntity = await repo.addRole(user, team);
        assert.equal(role.user.id, user.id);
        assert.equal(role.team.id, team.id);
        assert.equal(role.isLeader, false);
        team = await teamRepo.getTeamById("citc");
        role = await repo.addRole(user, team);
        assert.equal(role.user.id, user.id);
        assert.equal(role.team.id, team.id);
        assert.equal(role.isLeader, false);

        user = await userRepo.getUserById(0);
        assert.equal(user.roles.length, 2);

        role = await repo.addRole(user, team);
        assert.equal(role.user.id, user.id);
        assert.equal(role.team.id, team.id);
        assert.equal(role.isLeader, false);
    });

    it('removes a role', async () => {
        await repo.removeRole(user, team);
        user = await userRepo.getUserById(0);
        assert.equal(user.roles.length, 1);
        assert.equal(user.roles[0].team.id, "citq");

        await repo.removeRole(user, team);
        user = await userRepo.getUserById(0);
        assert.equal(user.roles.length, 1);
    });

    it('adds a leader', async () => {
        team = await teamRepo.getTeamById("citq");
        await repo.addLeader(user, team);
        user = await userRepo.getUserById(0);
        assert.equal(user.roles[0].isLeader, true);

        team = await teamRepo.getTeamById("citi");
        await repo.addLeader(user, team);
        user = await userRepo.getUserById(0);
        let role: RoleEntity = user.roles.find((r: RoleEntity) => r.team.id === "citi");
        assert.equal(role.isLeader, true);
    });

    it('remove a leader', async () => {
        assert.equal(user.roles.length, 2);
        await repo.removeLeader(user, team);
        user = await userRepo.getUserById(0);
        assert.equal(user.roles.length, 2);
        assert.equal(user.roles[0].isLeader, false);
        assert.equal(user.roles[1].isLeader, true);

        team = await teamRepo.getTeamById("admin");
        await repo.removeLeader(user, team);
        user = await userRepo.getUserById(0);
        assert.equal(user.roles.length, 2);
        assert.equal(user.roles[0].isLeader, false);
        assert.equal(user.roles[1].isLeader, true);

    });

    after(async () => {
        await database.closeConnection();
    })
})


