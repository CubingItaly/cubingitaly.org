import { TeamModel } from '../../../server/models/classes/team.model';
import { assert } from 'chai';
import 'mocha';
import { RoleModel } from '../../../server/models/classes/role.model';


let team: TeamModel;

function generateRole(user: number, team: string, isLeader: boolean): RoleModel {
    let role: RoleModel = new RoleModel();
    role.isLeader = isLeader;
    role.team = team;
    role.user = user;
    return role;
}

function generateTeam(name: string, id: string, isPublic: boolean) {
    let team: TeamModel = new TeamModel();
    team.name = name;
    team.id = id;
    team.isPublic = isPublic;
    return team;
}


describe('Test the method to check if the team has a leader', () => {

    it('Test a team without members', () => {
        let team: TeamModel = generateTeam('citi', "CITI", true);
        assert.equal(team.hasLeader(), false);
    });

    it('Test a team with undefined members', () => {
        let team: TeamModel = generateTeam('citi', "CITI", true);
        team.roles = undefined;
        assert.equal(team.hasLeader(), false);
    });

    it('Test a team with null members', () => {
        let team: TeamModel = generateTeam('citi', "CITI", true);
        team.roles = null;
        assert.equal(team.hasLeader(), false);
    });


    it('Test a team with a member', () => {
        let team: TeamModel = generateTeam('citi', "CITI", true);
        team.roles = [generateRole(1, "citi", false)];
        assert.equal(team.hasLeader(), false);
    });


    it('Test a team with a leader', () => {
        let team: TeamModel = generateTeam('citi', "CITI", true);
        team.roles = [generateRole(1, "citi", true)];
        assert.equal(team.hasLeader(), true);
    });


    it('Test a team with a member and a leader', () => {
        let team: TeamModel = generateTeam('citi', "CITI", true);
        team.roles = [generateRole(1, "citi", false)];
        team.roles = [generateRole(2, "citi", true)];
        assert.equal(team.hasLeader(), true);
    });




})
