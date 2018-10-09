import { UserModel } from '../../../server/models/classes/user.model';
import { assert } from 'chai';
import 'mocha';
import { RoleModel } from '../../../server/models/classes/role.model';
import { TeamModel } from '../../../server/models/classes/team.model';

let user: UserModel;

function generateRole(leader: boolean, team: string, user: number): RoleModel {
    let role: RoleModel = new RoleModel();
    role.isLeader = leader;
    role.team = team;
    role.user = user;
    return role;
}

function generateUser(id: number, name: string, wcaId: string, delegateStaus: string) {
    let user: UserModel = new UserModel();
    user.id = id;
    user.name = name;
    user.wca_id = wcaId;
    user.delegate_status = delegateStaus;
    return user;
}

describe('Check if user is delegate', () => {

    it('test for a user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.isDelegate(), false);
    });


    it('test for a candidate delegate', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", "candidate_delegate");
        assert.equal(user.isDelegate(), true);
    });


    it('test for a delegate', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", "delegate");
        assert.equal(user.isDelegate(), true);
    });

});

describe('Check if user is member of a team', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.isMemberOf("citi"), false);
    });

    it('test for a member', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        user.roles = [generateRole(false, "citi", 1)];
        assert.equal(user.isMemberOf("citi"), true);
    });

    it('test for a member of another team', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        user.roles = [generateRole(false, "citq", 1)];
        assert.equal(user.isMemberOf("citi"), false);
    });
});

describe('Check if the user is leader of a team', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.isLeaderOf("citi"), false);
    });

    it('test for a member of the team', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        user.roles = [generateRole(false, "citi", 1)];
        assert.equal(user.isLeaderOf("citi"), false);
    });

    it('test for a member of another team', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        user.roles = [generateRole(false, "citq", 1)];
        assert.equal(user.isLeaderOf("citi"), false);
    });


    it('test for the leader of the team', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        user.roles = [generateRole(true, "citi", 1)];
        assert.equal(user.isLeaderOf("citi"), true);
    });

    it('test for a leader of another team', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        user.roles = [generateRole(true, "citq", 1)];
        assert.equal(user.isLeaderOf("citi"), false);
    });

});

describe('Check if user can admin users', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canAdminUsers(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: false },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: false },
            { team: "citi", isLeader: true, expected: false },
            { team: "citq", isLeader: true, expected: false },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canAdminUsers(), u.expected);
        })
    }
});


describe('Check if user can admin teams', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canAdminTeams(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: false },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: false },
            { team: "citi", isLeader: true, expected: false },
            { team: "citq", isLeader: true, expected: false },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canAdminTeams(), u.expected);
        })
    }
});


describe('Check if user can manage teams', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canManageTeams(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: false },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: true },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canManageTeams(), u.expected);
        })
    }
});

describe('Check if user can manage a team', () => {

    let citc: TeamModel;

    before(() => {
        citc = new TeamModel();
        citc.id = "citc";
        citc.name = "CITI";
        citc.isPublic = true;
    });

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canManageTeam(citc), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: false },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: false },
            { team: "citq", isLeader: true, expected: false },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canManageTeam(citc), u.expected);
        })
    }
});


describe('Check if user can admin articles', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canAdminArticles(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: true },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: false },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canAdminArticles(), u.expected);
        })
    }
});

describe('Check if user can edit articles', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canEditArticles(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: true },
            { team: "citq", isLeader: false, expected: true },
            { team: "citc", isLeader: false, expected: true },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: true },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canEditArticles(), u.expected);
        })
    }
});

describe('Check if user can admin tutorials', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canAdminTutorials(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: false },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: false },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canAdminTutorials(), u.expected);
        })
    }
}); 


describe('Check if user can create tutorials', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canCreateTutorials(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: true },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: false },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: false },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canCreateTutorials(), u.expected);
        })
    }
}); 

describe('Check if user can publish tutorials', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canPublishTutorials(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: false },
            { team: "citq", isLeader: false, expected: false },
            { team: "citc", isLeader: false, expected: true },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: true },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canPublishTutorials(), u.expected);
        })
    }
}); 


describe('Check if user can edit pages', () => {

    it('test for a normal user', () => {
        let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
        assert.equal(user.canEditPages(), false);
    });

    let users: { team: string, isLeader: boolean, expected: boolean }[] =
        [
            { team: "admin", isLeader: false, expected: true },
            { team: "board", isLeader: false, expected: true },
            { team: "citi", isLeader: false, expected: true },
            { team: "citq", isLeader: false, expected: true },
            { team: "citc", isLeader: false, expected: true },
            { team: "admin", isLeader: true, expected: true },
            { team: "board", isLeader: true, expected: true },
            { team: "citc", isLeader: true, expected: true },
            { team: "citi", isLeader: true, expected: true },
            { team: "citq", isLeader: true, expected: true },
            { team: "fake", isLeader: false, expected: false },
        ]

    for (let u of users) {
        it('test for a team member', () => {
            let user: UserModel = generateUser(1, "name", "20010CUBI01", null);
            user.roles = [generateRole(u.isLeader, u.team, 1)];
            assert.equal(user.canEditPages(), u.expected);
        })
    }
}); 