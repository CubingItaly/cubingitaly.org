import 'mocha';
import { assert, expect } from 'chai';
import { Database } from '../database';
import { MysqlTool } from './mysql.tool';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../repository/role.repository';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { TeamRepository } from '../repository/team.repository';
import { TeamEntity } from '../entity/team.entity';
import { RoleEntity } from '../entity/role.entity';
import { UserModel } from '../../models/classes/user.model';


let database: Database;
let dbTool: MysqlTool;
let roleRepo: RoleRepository;
let userRepo: UserRepository;
let teamRepo: TeamRepository;


describe('Test the Role Repository', async () => {
    before(async () => {
        dbTool = new MysqlTool();
        await dbTool.prepareDatabaseToTest();
        database = new Database();
        await database.createConnection();
        await database.initDatabase();
        roleRepo = getCustomRepository(RoleRepository);
        userRepo = getCustomRepository(UserRepository);
        teamRepo = getCustomRepository(TeamRepository);

        let user: UserEntity = new UserEntity();
        user.id = 1;
        user.name = "User Name";
        await userRepo.updateUser(user);
        user.id = 2;
        user.name = "Name User";
        await userRepo.updateUser(user);
    });

    after(async () => {
        await database.closeConnection();
        await dbTool.restoreDatabaseAfterTest();
    });

    it('Test the method to add a role and the method to get users by team', async () => {
        let user: UserEntity = await userRepo.getShortUserById(1);
        let team: TeamEntity = await teamRepo.getTeamById("citi");

        let role: RoleEntity = await roleRepo.addRole(user, team);
        assert.equal(false, role.isLeader);
        assert.equal(1, role.user.id);
        assert.equal("citi", role.team.id);

        role = await roleRepo.addRole(user, team);
        assert.equal(false, role.isLeader);
        assert.equal(1, role.user.id);
        assert.equal("citi", role.team.id);

        let users: UserEntity[] = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);

        team = await teamRepo.getTeamById("citq");
        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 0);
    });

    it('Test the method to delete a role', async () => {
        let user: UserEntity = await userRepo.getShortUserById(1);
        let team: TeamEntity = await teamRepo.getTeamById("citi");

        let users: UserEntity[] = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);

        await roleRepo.removeRole(user, team);

        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 0);

        // try again when no role exist
        await roleRepo.removeRole(user, team);

        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 0);
    });

    it('Test the method to promote a member to leader', async () => {
        let user: UserEntity = await userRepo.getShortUserById(1);
        let team: TeamEntity = await teamRepo.getTeamById("citi");
        let role: RoleEntity = await roleRepo.addRole(user, team);
        assert.equal(role.isLeader, false);

        role = await roleRepo.addLeader(user, team);
        assert.equal(role.isLeader, true);

        let users: UserEntity[] = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);
        assert.equal(users[0].id, user.id);
    });

    it('Test the method to directly promote a user to leader', async () => {

        let team: TeamEntity = await teamRepo.getTeamById("citq");
        let users: UserEntity[] = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 0);

        let user: UserEntity = await userRepo.getShortUserById(2);
        let role: RoleEntity = await roleRepo.addLeader(user, team);
        assert.equal(role.isLeader, true);

        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);
        assert.equal(users[0].id, user.id);
    });

    it('Test the method to demote a leader to member', async () => {
        let team: TeamEntity = await teamRepo.getTeamById("citq");
        let users: UserEntity[] = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);

        let user: UserEntity = await userRepo.getShortUserById(2);
        let role: RoleEntity = await roleRepo.removeLeader(user, team);

        assert.equal(role.isLeader, false);

        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);

        // Let's try to demote a leader from a role who doesn't exist
        team = await teamRepo.getTeamById("citi");
        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);
        assert.equal(users[0].id, 1);
        await roleRepo.removeLeader(user, team);
        users = await userRepo.findUsersByTeam(team);
        assert.equal(users.length, 1);
        assert.equal(users[0].id, 1);
        //check if he is still leader of citi
        user = await userRepo.getUserById(1);
        let model: UserModel = user._transform();
        assert.equal(model.isLeaderOf("citi"), true);
    });
});