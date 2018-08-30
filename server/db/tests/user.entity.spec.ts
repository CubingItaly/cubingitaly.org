import 'mocha';
import { assert, expect } from 'chai';
import { UserEntity } from '../entity/user.entity';
import { UserModel } from '../../models/classes/user.model';
import { RoleEntity } from '../entity/role.entity';
import { TeamEntity } from '../entity/team.entity';

let user: UserEntity;


describe('Test the assimilate method', () => {
    beforeEach(() => {
        user = new UserEntity();
    });

    afterEach

    it('assimilates an user', () => {
        let userModel: UserModel = new UserModel();
        userModel.id = 0;
        userModel.name = "Test Name";
        userModel.wca_id = "2010NAME01";
        userModel.delegate_status = "Delegate"

        user._assimilate(userModel);

        expect(user.id).to.equal(0);
        expect(user.name).to.equal("Test Name");
        expect(user.wcaId).to.equal("2010NAME01");
        expect(user.delegateStatus).to.equal("Delegate");

    });

    it('assimilates an user with null WCA ID and Delegate status', () => {
        let userModel: UserModel = new UserModel();
        userModel.id = 0;
        userModel.name = "Test Name";

        user._assimilate(userModel);

        expect(user.id).to.equal(0);
        expect(user.name).to.equal("Test Name");
        expect(user.wcaId).to.equal(undefined);
        expect(user.delegateStatus).to.equal(undefined);

    });

});

describe('Test the transform method', () => {
    beforeEach(() => {
        user = new UserEntity();
        user.id = 0;
        user.name = "Test Name";
        user.wcaId = "2010NAME01";
        user.delegateStatus = "Delegate"
    });

    it('Test a user with no roles', () => {
        const userModel: UserModel = user._transform();

        expect(userModel.id).to.equal(0);
        expect(userModel.name).to.equal("Test Name");
        expect(userModel.wca_id).to.equal("2010NAME01");
        expect(userModel.delegate_status).to.equal("Delegate");
        expect(userModel.roles).to.length(0);
    });

    it('Test a user with a role', () => {
        let role: RoleEntity = new RoleEntity();
        role.user = user;
        role.isLeader = true;
        let team: TeamEntity = new TeamEntity();
        team.id = "team";
        team.name = "Team";
        role.team = team;

        user.roles = [];
        user.roles.push(role);

        const userModel: UserModel = user._transform();

        expect(userModel.roles).to.length(1);
        assert.equal(userModel.roles[0].isLeader, true);
        expect(userModel.roles[0].team).to.equal(team.id);
        expect(userModel.roles[0].user).to.equal(user.id);

    });

    it('Test a user with a null role', () => {
        let role: RoleEntity = new RoleEntity();
        role.user = null;
        role.isLeader = null;
        role.team = null;

        user.roles = [];
        user.roles.push(role);
        const userModel: UserModel = user._transform();
        expect(userModel.roles).to.length(0);
    })

    it('Test a user with null roles', () => {
        user.roles = null;
        const userModel: UserModel = user._transform();
        expect(userModel.roles).to.length(0);
    });

});