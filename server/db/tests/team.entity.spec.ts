import 'mocha';
import { assert, expect } from 'chai';
import { TeamEntity } from '../entity/team.entity';
import { TeamModel } from '../../models/classes/team.model';
import { RoleEntity } from '../entity/role.entity';
import { UserEntity } from '../entity/user.entity';

let team: TeamEntity;

describe('Test the assimilate function of a TeamEntity', () => {

    before(() => {
        team = new TeamEntity();
    });

    it('Test the assimilate function', () => {
        let teamModel: TeamModel = new TeamModel();
        teamModel.id = "citi";
        teamModel.name = "Team Name";
        teamModel.isPublic = true;

        team._assimilate(teamModel);

        expect(team.id).to.equal(teamModel.id);
        expect(team.name).to.equal(teamModel.name);
        assert.equal(team.isPublic, true);
    });

    it('Test the assimilate with isPublic=undefined', () => {
        let teamModel: TeamModel = new TeamModel();
        teamModel.id = "citi";
        teamModel.name = "Team Name";

        team._assimilate(teamModel);

        expect(team.id).to.equal(teamModel.id);
        expect(team.name).to.equal(teamModel.name);
        assert.equal(team.isPublic, true);
    });

});

describe('Test the transform function of a TeamEntity', () => {

    beforeEach(() => {
        team = new TeamEntity();
        team.id = "citi";
        team.name = "TeamName";
        team.isPublic = true;
    });

    it('transform a team with no roles', () => {
        let teamModel: TeamModel = team._transform();

        expect(teamModel.id).to.equal("citi");
        expect(teamModel.name).to.equal("TeamName");
        assert.equal(teamModel.isPublic, true);
        expect(teamModel.roles).to.length(0);
    });

    it('transform a team with one roles', () => {

        let role: RoleEntity = new RoleEntity();
        let user: UserEntity = new UserEntity();
        user.id = 1;
        role.isLeader = true;
        role.team = team;
        role.user = user;

        team.roles = [];
        team.roles.push(role);

        let teamModel: TeamModel = team._transform();

        expect(teamModel.roles).to.length(1);
        expect(teamModel.roles[0].user).to.equal(1);
        expect(teamModel.roles[0].team).to.equal(team.id);
        assert.equal(teamModel.roles[0].isLeader, true);
    });

});

