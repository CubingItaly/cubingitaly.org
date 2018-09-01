
import 'mocha';
import * as sinon from 'sinon';
import * as loginUtils from '../../../shared/login.utils';
import * as errorUtils from '../../../shared/error.utils';

/* These need to be here because verifyLogin must be stubbed before the server is initialied */
let verifyLogin = function (req, res, next): void {
    if (loginUtils.isLoggedIn(req)) {
        next();
    } else {
        errorUtils.sendError(res, 403, "Login is required. Please, login and retry.")
    }
}

let verifyStub = sinon.stub(loginUtils, 'verifyLogin').callsFake(verifyLogin);
/* end of initialization part */

import { app } from './fakeserver';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as typeorm from 'typeorm';
import { Deserialize } from 'cerialize';
import { UserRepository } from '../../../db/repository/user.repository';
import { TeamRepository } from '../../../db/repository/team.repository';
import { RoleRepository } from '../../../db/repository/role.repository';
import { FakeRoleRepo } from './fake.role.repo';
import { FakeTeamRepo } from './fake.team.repo';
import { FakeUserRepo } from './fake.user.repo';
import { TeamEntity } from '../../../db/entity/team.entity';
import { UserModel } from '../../../models/classes/user.model';
import { TeamModel } from '../../../models/classes/team.model';
import { RoleModel } from '../../../models/classes/role.model';



chai.use(chaiHttp);

let statusStub = sinon.stub(loginUtils, 'isLoggedIn');
let userStub = sinon.stub(loginUtils, 'getUser');
let typeormStub = sinon.stub(typeorm, 'getCustomRepository');

let fakeUserRepo: FakeUserRepo = new FakeUserRepo();
let fakeTeamRepo: FakeTeamRepo = new FakeTeamRepo();
let fakeRoleRepo: FakeRoleRepo = new FakeRoleRepo();

describe('Test the team APIs', () => {
    before(() => {
        typeormStub.withArgs(UserRepository).returns(fakeUserRepo);
        typeormStub.withArgs(TeamRepository).returns(fakeTeamRepo);
        typeormStub.withArgs(RoleRepository).returns(fakeRoleRepo);
    });

    after(() => {
        verifyStub.restore();
        typeormStub.restore();
        statusStub.restore();
        userStub.restore();
    });


    it('Check the API to get a team', async () => {
        /* existing team */
        let res = await chai.request(app).get("/api/v0/teams/citi");
        chai.expect(res).to.have.status(200);

        /* not existing team */
        res = await chai.request(app).get("/api/v0/teams/cdasjassi")
        chai.expect(res).to.have.status(404);
    });


    it('Check the API to get all the teams', async () => {
        let res = await chai.request(app).get("/api/v0/teams");
        chai.expect(res).to.have.status(200);
        let teams: TeamEntity[] = Deserialize(res.body, TeamEntity);
        chai.assert.equal(teams.length, 5);
    });


    it('Check the API the get the users of a team', async () => {
        /* existing team */
        let res = await chai.request(app).get("/api/v0/teams/citi/members");
        chai.expect(res).to.have.status(200);
        let teams: TeamEntity[] = Deserialize(res.body, TeamEntity);
        chai.assert.equal(teams.length, 2);

        /* not existing team */
        res = await chai.request(app).get("/api/v0/teams/citasdai/members");
        chai.expect(res).to.have.status(404);
    });


    it('Test the middleware to check if the user is logged in ', async () => {
        statusStub.returns(false);

        /* user not logged in */
        let res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "member": 1 });
        chai.assert(res.body.message, "Login is required. Please, login and retry.");
        chai.expect(res).to.have.status(403);
    })


    it('Test the function to check if the team exists', async () => {
        statusStub.returns(true);

        /* user logged in, team doesn't exist*/
        userStub.returns((await fakeUserRepo.getUserById(1))._transform());
        let res = await chai.request(app).post("/api/v0/teams/cifdsati/members").send({ "member": 1 });
        chai.assert(res.body.message, "The requested team does not exist.");
        chai.expect(res).to.have.status(404);
    });


    it('Test the function to check if the user can manage teams', async () => {
        statusStub.returns(true);

        /* user logged in, no roles */
        let res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "member": 1 });
        chai.assert(res.body.message, "Operation not authorized, you don't have enough permissions to perform this request.");
        chai.expect(res).to.have.status(403);


        /* user logged in, can't manage teams (team member) */
        userStub.returns((await fakeUserRepo.getUserById(6))._transform());
        res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "member": 1 });
        chai.assert(res.body.message, "Operation not authorized, you don't have enough permissions to perform this request.");
        chai.expect(res).to.have.status(403);

    });


    it('Test the function to check if the user is in the request', async () => {
        statusStub.returns(true);

        /* user logged in, can manage teams (team leader), user not in the request */
        userStub.returns((await fakeUserRepo.getUserById(3))._transform());
        let res = await chai.request(app).post("/api/v0/teams/citi/members").send({});
        chai.assert(res.body.message, "Bad request. The request is malformed.");
        chai.expect(res).to.have.status(400);

    });


    it('Test the function to check if the user exists', async () => {
        statusStub.returns(true);

        /* user logged in, can manage teams (team leader), user doesn't exist */
        let res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "member": 11 });
        chai.assert(res.body.message, "The requested user does not exist");
        chai.expect(res).to.have.status(404);

        res = await chai.request(app).del("/api/v0/teams/citi/members/11");
        chai.assert(res.body.message, "The requested user does not exist");
        chai.expect(res).to.have.status(404);

    });


    it('Test the API to add a new Role', async () => {
        statusStub.returns(true);
        let spy = sinon.spy(fakeRoleRepo, 'addRole');

        /* user logged in, can manage teams (team leader) */
        let res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "member": 1 });
        chai.expect(res).to.have.status(200);
        let role: RoleModel = Deserialize(res.body, RoleModel);
        chai.assert(role.team, "citi");
        chai.assert.equal(role.user, 1);
        chai.assert.equal(role.isLeader, false);
        chai.assert.equal(spy.calledOnce, true);

        spy.restore();
        spy = sinon.spy(fakeRoleRepo, 'addRole');

        /* user logged in, can manage teams (team admin) */
        userStub.returns((await fakeUserRepo.getUserById(2))._transform());
        res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "member": 1 });
        chai.expect(res).to.have.status(200);
        role = Deserialize(res.body, RoleModel);
        chai.assert(role.team, "citi");
        chai.assert.equal(role.user, 1);
        chai.assert.equal(role.isLeader, false);

        chai.assert.equal(spy.calledOnce, true);
    });


    it('Test the API to delete a Role', async () => {
        statusStub.returns(true);
        /* admin */
        userStub.returns((await fakeUserRepo.getUserById(2))._transform());
        let res = await chai.request(app).del("/api/v0/teams/citi/members/3");
        chai.expect(res).to.have.status(200);

    });


    it('Test the middleware to check if a user can admin teams', async () => {
        statusStub.returns(true);

        /* Normal user */
        userStub.returns((await fakeUserRepo.getUserById(1))._transform());
        let res = await chai.request(app).put("/api/v0/teams/citi/leaders").send({ "member": 1 });
        chai.expect(res).to.have.status(403);

        /* CITI member */
        userStub.returns((await fakeUserRepo.getUserById(6))._transform());
        res = await chai.request(app).put("/api/v0/teams/citi/leaders").send({ "member": 1 });
        chai.expect(res).to.have.status(403);

        /* CITI leader */
        userStub.returns((await fakeUserRepo.getUserById(3))._transform());
        res = await chai.request(app).put("/api/v0/teams/citi/leaders").send({ "member": 1 });
        chai.expect(res).to.have.status(403);
    });


    it('Test the API to promote a member to leader', async () => {
        statusStub.returns(true);
        let spy = sinon.spy(fakeRoleRepo, 'addLeader');

        /* Admin */
        userStub.returns((await fakeUserRepo.getUserById(2))._transform());
        let res = await chai.request(app).put("/api/v0/teams/citi/leaders").send({ "member": 1 });
        chai.expect(res).to.have.status(200);

        chai.assert.equal(spy.calledOnce, true);

        spy.restore();
        spy = sinon.spy(fakeRoleRepo, 'addLeader');

        /* Board member */
        userStub.returns((await fakeUserRepo.getUserById(9))._transform());
        res = await chai.request(app).put("/api/v0/teams/citi/leaders").send({ "member": 1 });
        chai.expect(res).to.have.status(200);

        chai.assert.equal(spy.calledOnce, true);
    });


    it('Test the API to demote a leader to member', async () => {
        statusStub.returns(true);
        let spy = sinon.spy(fakeRoleRepo, 'removeLeader');

        /* Admin */
        userStub.returns((await fakeUserRepo.getUserById(2))._transform());
        let res = await chai.request(app).del("/api/v0/teams/citi/leaders/1");
        chai.expect(res).to.have.status(200);

        chai.assert.equal(spy.calledOnce, true);

        spy.restore();
        spy = sinon.spy(fakeRoleRepo, 'removeLeader');

        /* Board member */
        userStub.returns((await fakeUserRepo.getUserById(9))._transform());
        res = await chai.request(app).del("/api/v0/teams/citi/leaders/1");
        chai.expect(res).to.have.status(200);

        chai.assert.equal(spy.calledOnce, true);
    });

});