import 'mocha';
import * as sinon from 'sinon';
import { app } from './fakeserver';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as typeorm from 'typeorm';
import { FakeCategoryRepo } from './fake.category.repo';

chai.use(chaiHttp);



describe('Test the category APIs', () => {
    let fakeCategoryRepo: FakeCategoryRepo;
    let stub;

    before(async () => {
        fakeCategoryRepo = new FakeCategoryRepo();
        stub = sinon.stub(typeorm, 'getCustomRepository').returns(fakeCategoryRepo);
    });

    it('Test the API to get all the categories', async () => {
        let spy = sinon.spy(fakeCategoryRepo, 'getCategories');
        let res = await chai.request(app).get("/api/v0/categories");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(spy.calledOnce, true);
        spy.restore();
    });

    it('Test the API to get a category', async () => {
        let spy = sinon.spy(fakeCategoryRepo, 'getCategory');
        let res = await chai.request(app).get("/api/v0/categories/news");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(spy.calledOnce, true);
        spy.restore();

        res = await chai.request(app).get("/api/v0/categories/newasds");
        chai.expect(res).to.have.status(404);

    });

    after(async () => {
        stub.restore();
    });
});