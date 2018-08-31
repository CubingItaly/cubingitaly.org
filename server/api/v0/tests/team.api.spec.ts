
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

    it('Checks the API to add a new Role', async () => {
        statusStub.returns(false);

        /* user not logged in */
        let res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "team": "citi", "member": 1 });
        chai.expect(res).to.have.status(403);

        statusStub.returns(true);

        /* user logged in, no roles */
        userStub.returns((await fakeUserRepo.getUserById(1))._transform());
        res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "team": "citi", "member": 1 });
        chai.expect(res).to.have.status(403);

        /* user logged in, can't manage teams (team member) */
        userStub.returns((await fakeUserRepo.getUserById(6))._transform());
        res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "team": "citi", "member": 1 });
        chai.expect(res).to.have.status(403);

        /* user logged in, can't manage teams (team leader) */
        userStub.returns((await fakeUserRepo.getUserById(3))._transform());
        res = await chai.request(app).post("/api/v0/teams/citi/members").send({ "team": "citi", "member": 1 });
        console.log(res.body);
        chai.expect(res).to.have.status(200);


    });

});