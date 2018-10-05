import { TeamModel } from '../classes/team.model';
import { assert } from 'chai';
import 'mocha';
import { RoleModel } from '../classes/role.model';


let team: TeamModel;

function generateRole(user: number, team: string, isLeader: boolean): RoleModel {
    let role: RoleModel = new RoleModel();
    role.isLeader = isLeader;
    role.team = team;
    role.user = user;
    return role;
}


describe('Test the function to check if the team has a leader', () => {

    before(() => {
        team = new TeamModel();
        team.id = "team";
        team.name = "Test Team";
        team.roles = []
    });

    afterEach(() => {
        team.roles = [];
    });

    it('checks a team with no members, roles null', () => {
        team.roles = null;
        assert.equal(team.hasLeader(), false);
    });

    it('checks a team with no members', () => {
        assert.equal(team.hasLeader(), false);
    });

    it('checks a team with a member and no leader', () => {
        team.roles.push(generateRole(0, "test", false));
        assert.equal(team.hasLeader(), false);
    });

    it('checks a team with two members and no leader', () => {
        team.roles.push(generateRole(0, "test", false));
        team.roles.push(generateRole(1, "test", false));
        assert.equal(team.hasLeader(), false);
    });

    it('checks a team with a member who is also leader', () => {
        team.roles.push(generateRole(0, "test", true));
        assert.equal(team.hasLeader(), true);
    });

    it('checks a team with a member who is also leader', () => {
        team.roles.push(generateRole(0, "test", true));
        team.roles.push(generateRole(1, "test", false));
        assert.equal(team.hasLeader(), true);
    });

});