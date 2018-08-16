import { UserModel } from '../classes/user.model';
import { assert } from 'chai';
import 'mocha';
import { RoleModel } from '../classes/role.model';
import { TeamModel } from '../classes/team.model';

let user: UserModel;

function generateRole(leader: boolean, team: string, user: number): RoleModel {
    let role: RoleModel = new RoleModel();
    role.isLeader = leader;
    role.team = team;
    role.user = user;
    return role;

}

describe('Test function to check if user is delegate', function () {

    let tests = [
        { status: null, expected: false },
        { status: "Delegate", expected: true },
        { status: "Candidate Delegate", expected: true }
    ]

    tests.forEach((test) => {
        before(() => {
            user = new UserModel();
            user.id = 0;
            user.name = "Test Name";
            user.wca_id = "2010NAME01";
        });
        it('Checks if user is delegate', () => {
            user.delegate_satus = test.status;

            assert.equal(user.isDelegate(), test.expected);
        });
    });

});


describe('Test memberships', () => {
    before(() => {
        user.id = 0;
        user.name = "Test Name";
        user.delegate_satus = null;
        user.wca_id = null;
    });

    afterEach(() => {
        user.roles = [];
    });

    it('Test a user who is a member of team citi', () => {
        let role: RoleModel = generateRole(false, "citi", 0);
        user.roles.push(role);

        assert.equal(user.isMemberOf("citi"), true);
    });

    it('Test a user who is a member of no teams', () => {
        assert.equal(user.isMemberOf("citi"), false);
    });

    it('Test a user who is a member of team but not of citi', () => {
        let role: RoleModel = generateRole(false, "citq", 0);
        user.roles.push(role);

        assert.equal(user.isMemberOf("citi"), false);
    });

    it('Test a user with a broken role that has a wrong user id', () => {
        let role: RoleModel = generateRole(false, "citq", 1);
        user.roles.push(role);

        assert.equal(user.isMemberOf("citi"), false);
    });

    it('Test a user who is leader of citi an member of citq', () => {
        let role: RoleModel = generateRole(false, "citq", 0);
        user.roles.push(role);
        role = generateRole(true, "citi", 0);
        user.roles.push(role);

        assert.equal(user.isMemberOf("citq"), true);
        assert.equal(user.isMemberOf("citi"), true);
        assert.equal(user.isLeaderOf("citi"), true);
    })

});

describe('Test permissions', () => {

    beforeEach(() => {
        user.id = 0;
        user.name = "Test Name";
        user.delegate_satus = null;
        user.wca_id = null;
    });

    afterEach(() => {
        user.roles = [];
    });

    it('Test if a user can admin users', () => {
        assert.equal(user.canAdminUsers(), false);

        let role: RoleModel = generateRole(false, "citq", 0);
        user.roles.push(role);
        assert.equal(user.canAdminUsers(), false);

        role = generateRole(false, "admin", 0);
        user.roles.push(role);
        assert.equal(user.canAdminUsers(), true);

        user.roles.pop();

        role = generateRole(false, "board", 0);
        user.roles.push(role);
        assert.equal(user.canAdminUsers(), true);

    });


    it('Test if a user can manage a team', () => {
        let team: TeamModel = new TeamModel;
        team.id = "citi";
        team.name = "CITI";

        assert.equal(user.canManageTeam(team), false);

        //CITI member
        let role: RoleModel = generateRole(false, "citi", 0);
        user.roles.push(role);
        assert.equal(user.canManageTeam(team), false);

        user.roles = [];

        //CITQ leader
        role = generateRole(true, "citq", 0);
        user.roles.push(role);
        assert.equal(user.canManageTeam(team), false);

        user.roles = [];

        //CITI leader
        role = generateRole(true, "citi", 0);
        user.roles.push(role);
        assert.equal(user.canManageTeam(team), true);

        user.roles = [];

        //An admin
        role = generateRole(false, "admin", 0);
        user.roles.push(role);
        assert.equal(user.canManageTeam(team), true);

    });


    it('Test if a user can admin articles', () => {
        assert.equal(user.canAdminArticles(), false);

        //CITI leader
        let role: RoleModel = generateRole(true, "citi", 0);
        user.roles.push(role);
        assert.equal(user.canAdminArticles(), false);

        user.roles = [];

        //CITC member
        role = generateRole(false, "citc", 0);
        user.roles.push(role);
        assert.equal(user.canAdminArticles(), true);

        user.roles = [];

        //CITC leader
        role = generateRole(true, "citc", 0);
        user.roles.push(role);
        assert.equal(user.canAdminArticles(), true);

        user.roles = [];

        //An admin
        role = generateRole(false, "admin", 0);
        user.roles.push(role);
        assert.equal(user.canAdminArticles(), true);

    });


    it('Test if a user can edit articles', () => {
        assert.equal(user.canEditArticles(), false);

        let teams: string[] = ["admin", "board", "citc", "citi", "citq"];
        let role: RoleModel;

        teams.forEach(team => {
            role = generateRole(false, team, 0);
            user.roles.push(role);
            assert.equal(user.canEditArticles(), true);
            user.roles = [];
        });

        //fake team
        role = generateRole(false, "fake", 0);
        user.roles.push(role);
        assert.equal(user.canEditArticles(), false);
        user.roles = [];
    });

});

