import 'mocha';
import * as sinon from 'sinon';
import { app } from './fakeserver';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as typeorm from 'typeorm';
import { FakeUserRepo } from './fake.user.repo';
import { UserModel } from '../../../models/classes/user.model';
import { Deserialize } from 'cerialize';
import * as loginUtils from '../../../shared/login.utils';
import { UserRepository } from '../../../db/repository/user.repository';
chai.use(chaiHttp);



describe('Test the user API', () => {

    let mock;
    let fakeRepo: FakeUserRepo;

    before(() => {
        fakeRepo = new FakeUserRepo();
        mock = sinon.stub(typeorm, 'getCustomRepository').returns(fakeRepo);
    });


    it('Test the API to find users by name', async () => {
        /** name starts with t */
        let spy = sinon.spy(fakeRepo, 'findUsersByName');
        let res = await chai.request(app).get("/api/v0/users?name=t");
        chai.expect(res).to.have.status(200);
        chai.assert(spy.withArgs("t").calledOnce);

        /** no name specified */
        res = await chai.request(app).get("/api/v0/users?");
        chai.expect(res).to.have.status(200);
        let users: UserModel[] = Deserialize(res.body, UserModel);
        chai.assert(spy.withArgs("").calledOnce);
    });


    it('Test the API to get a user who doesn\'t exist', async () => {
        let res = await chai.request(app).get("/api/v0/users/11");
        chai.expect(res).to.have.status(404);
        chai.expect(res.body.error).to.equal(404);
        chai.expect(res.body.message).to.equal("The requested user does not exist.");
    });


    it('Test the API to get a user', async () => {
        let res = await chai.request(app).get("/api/v0/users/2");
        chai.expect(res).to.have.status(200);
        let user: UserModel = Deserialize(res.body, UserModel);
        chai.assert.equal(user.roles.length, 1);
    });


    it('Test the API to get a short user', async () => {
        let res = await chai.request(app).get("/api/v0/users/2/short");
        chai.expect(res).to.have.status(200);
        let user: UserModel = Deserialize(res.body, UserModel);
        chai.assert.equal(user.roles.length, 0);
    });


    it('Test the API to get the profile of the current user', async () => {
        let user: UserModel = new UserModel();
        user.id = 2;
        let fakeUser = sinon.stub(loginUtils, 'getUser').returns(user);
        let fakeStatus = sinon.stub(loginUtils, 'isLoggedIn').returns(true);
        let res = await chai.request(app).get("/api/v0/users/me");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(res.body.id, 2);
        fakeStatus.restore();
        fakeUser.restore();
    });


    it('Test the API to get the user profile when no user is logged in', async () => {
        let fakeStatus = sinon.stub(loginUtils, 'isLoggedIn').returns(false);
        let res = await chai.request(app).get("/api/v0/users/me");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(res.body.id, undefined);
        fakeStatus.restore();
    });

    after(() => {
        mock.restore();
    })
});