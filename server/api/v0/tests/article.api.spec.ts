
import 'mocha';
import * as sinon from 'sinon';
import * as loginUtils from '../../../shared/login.utils';
import { app } from './fakeserver';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as typeorm from 'typeorm';
import { Deserialize } from 'cerialize';
import { UserRepository } from '../../../db/repository/user.repository';
import { FakeUserRepo } from './fake.user.repo';
import { FakeArticleRepo } from './fake.article.repo';
import { FakeCategoryRepo } from './fake.category.repo';
import { ArticleRepository } from '../../../db/repository/article.repository';
import { ArticleCategoryRepository } from '../../../db/repository/category.repository';
import { UserModel } from '../../../models/classes/user.model';
import { ArticleModel } from '../../../models/classes/article.model';

chai.use(chaiHttp);

describe('Test the Article APIs', () => {

    let statusStub;
    let userStub;
    let typeormStub;

    let fakeUserRepo: FakeUserRepo;
    let fakeArticleRepo: FakeArticleRepo;
    let fakeCategoryRepo: FakeCategoryRepo;

    before(async () => {

        fakeUserRepo = new FakeUserRepo();
        fakeArticleRepo = new FakeArticleRepo();
        fakeCategoryRepo = new FakeCategoryRepo();

        statusStub = sinon.stub(loginUtils, 'isLoggedIn');
        userStub = sinon.stub(loginUtils, 'getUser');
        typeormStub = sinon.stub(typeorm, 'getCustomRepository');
        typeormStub.withArgs(UserRepository).returns(fakeUserRepo);
        typeormStub.withArgs(ArticleRepository).returns(fakeArticleRepo);
        typeormStub.withArgs(ArticleCategoryRepository).returns(fakeCategoryRepo);
    });

    after(async () => {
        typeormStub.restore();
        statusStub.restore();
        userStub.restore();
    });

    it('Test the method to count all the public articles', async () => {
        let spy = sinon.spy(fakeArticleRepo, 'countPublicArticles');
        let res = await chai.request(app).get("/api/v0/articles/count/public");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spy.calledOnce);
        spy.restore();
    });

    it('Test the method to count all articles when not logged in', async () => {
        let spy = sinon.spy(fakeArticleRepo, 'countAllArticles');
        let res = await chai.request(app).get("/api/v0/articles/count/all");
        chai.expect(res).to.have.status(403);
        chai.assert.equal(res.body.message, "Login is required. Please, login and retry.");
        chai.assert.equal(false, spy.calledOnce);
        spy.restore();
    });


    it('Test the method to count all articles when logged in but without permissions', async () => {
        let spy = sinon.spy(fakeArticleRepo, 'countAllArticles');
        statusStub.returns(true);

        let user: UserModel = (await fakeUserRepo.getUserById(1))._transform();
        userStub.returns(user);

        let res = await chai.request(app).get("/api/v0/articles/count/all");
        chai.expect(res).to.have.status(403);
        chai.assert.equal(res.body.message, "Operation not authorized, you don't have enough permissions to perform this request.");
        chai.assert.equal(false, spy.calledOnce);

        user = (await fakeUserRepo.getUserById(6))._transform();
        userStub.returns(user);

        res = await chai.request(app).get("/api/v0/articles/count/all");
        chai.expect(res).to.have.status(403);
        chai.assert.equal(res.body.message, "Operation not authorized, you don't have enough permissions to perform this request.");
        spy.restore();
    });

    it('Test the method to count all articles when logged in without permissions', async () => {
        let spy = sinon.spy(fakeArticleRepo, 'countAllArticles');
        statusStub.returns(true);

        let user: UserModel = (await fakeUserRepo.getUserById(5))._transform();
        userStub.returns(user);

        let res = await chai.request(app).get("/api/v0/articles/count/all");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spy.calledOnce);

        user = (await fakeUserRepo.getUserById(8))._transform();
        userStub.returns(user);
        res = await chai.request(app).get("/api/v0/articles/count/all");
        chai.expect(res).to.have.status(200);

        user = (await fakeUserRepo.getUserById(2))._transform();
        userStub.returns(user);
        res = await chai.request(app).get("/api/v0/articles/count/all");
        chai.expect(res).to.have.status(200);

        spy.restore();
    });


    it('Test the API to get public articles', async () => {
        let spy = sinon.spy(fakeArticleRepo, 'getPublicArticles');
        //Test with no category, default page and limit
        let res = await chai.request(app).get("/api/v0/articles");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spy.withArgs(12, 0).calledOnce);

        spy.restore();
        spy = sinon.spy(fakeArticleRepo, 'getPublicArticles');

        //Test with no category, custom page and limit
        res = await chai.request(app).get("/api/v0/articles?page=1&limit=15");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spy.withArgs(15, 1).calledOnce);

        spy.restore();
        spy = sinon.spy(fakeArticleRepo, 'getArticlesByCategory');

        //Test with category, default page and limit
        res = await chai.request(app).get("/api/v0/articles?category=news");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spy.withArgs(12, 0, "news").calledOnce);

        spy.restore();
        spy = sinon.spy(fakeArticleRepo, 'getArticlesByCategory');

        //Test with category, default page and limit
        res = await chai.request(app).get("/api/v0/articles?page=3&limit=18&category=news");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spy.withArgs(18, 3, "news").calledOnce);

        spy.restore();

        //Test with wrong query params
        res = await chai.request(app).get("/api/v0/articles?page=3&limit=ciao&category=news");
        chai.expect(res).to.have.status(400);
        chai.assert(res.body.message, "Bad request. The request is malformed.");
    });

    it('Test the method to verify if the article is in the body and the method to create a new article', async () => {
        statusStub.returns(true);
        let user: UserModel = (await fakeUserRepo.getUserById(5))._transform();
        userStub.returns(user);

        let res = await chai.request(app).post("/api/v0/articles");
        chai.expect(res).to.have.status(400);
        chai.assert.equal(res.body.message, "Bad request. The request is malformed. Article is missing");

        let spyCreate = sinon.spy(fakeArticleRepo, 'createArticle');
        let spyUpdate = sinon.spy(fakeArticleRepo, 'adminUpdateArticle');
        let article: ArticleModel = new ArticleModel();
        article.title = "Nuovo articolo di prova";
        res = await chai.request(app).post("/api/v0/articles").send({ "article": article });
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spyCreate.calledOnce);
        chai.assert.equal(true, spyUpdate.calledOnce);
        spyCreate.restore();
        spyUpdate.restore();
    });

    it('Test the method to sanitize content', async () => {
        statusStub.returns(true);
        let user: UserModel = (await fakeUserRepo.getUserById(5))._transform();
        userStub.returns(user);

        let spyCreate = sinon.spy(fakeArticleRepo, 'createArticle');
        let article: ArticleModel = new ArticleModel();
        article.title = "<script>ciao</script> di prova";

        let res = await chai.request(app).post("/api/v0/articles").send({ "article": article });
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spyCreate.withArgs(" di prova").calledOnce);
        spyCreate.restore();
    });

    it('Test the method to check if the article has an id', async () => {
        statusStub.returns(true);
        let user: UserModel = (await fakeUserRepo.getUserById(5))._transform();
        userStub.returns(user);

        let article: ArticleModel = new ArticleModel();
        article.id = "test";
        article.title = "<script>ciao</script> di prova";

        let res = await chai.request(app).post("/api/v0/articles").send({ "article": article });
        chai.expect(res).to.have.status(400);
        chai.assert.equal(res.body.message, "Bad request. The request is malformed. The article shouldn't have an ID.");
    });

    it('Test the API to get an article', async () => {
        let spyCheck = sinon.spy(fakeArticleRepo, 'checkIfArticleExists');

        //user not logged in
        statusStub.returns(false);
        //get an article that doesn't exist
        let res = await chai.request(app).get("/api/v0/articles/dudududu");
        chai.expect(res).to.have.status(404);
        chai.assert.equal(res.body.message, "The requested article does not exist");
        chai.assert.equal(true, spyCheck.calledOnce);
        spyCheck.restore();

        let spyGet = sinon.spy(fakeArticleRepo, 'getArticleById');
        res = await chai.request(app).get("/api/v0/articles/two");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(true, spyGet.calledOnce);
        spyGet.restore();

        res = await chai.request(app).get("/api/v0/articles/zero");
        chai.expect(res).to.have.status(404);
        chai.assert.equal(res.body.message, "The requested article does not exist");

        //user logged in, citc
        statusStub.returns(true);

        let user = (await fakeUserRepo.getUserById(8))._transform();
        userStub.returns(user);

        res = await chai.request(app).get("/api/v0/articles/zero");
        chai.expect(res).to.have.status(200);
    });

    it('Test the method to delete an article', async () => {
        statusStub.returns(true);
        let user: UserModel = (await fakeUserRepo.getUserById(8))._transform();
        userStub.returns(user);

        let spy = sinon.spy(fakeArticleRepo, 'deleteArticle');
        let res = await chai.request(app).del("/api/v0/articles/zero/admin");
        chai.expect(res).to.have.status(200);
        chai.assert.equal(spy.calledOnce, true);
        spy.restore();
    });

    it('Test the method to update an article with editor privileges', async () => {
        statusStub.returns(true);
        let user: UserModel = (await fakeUserRepo.getUserById(1))._transform();
        userStub.returns(user);

        let article: ArticleModel = new ArticleModel();
        article.id = "zero";
        article.title = "Nuovo articolo di prova";
        let res = await chai.request(app).put("/api/v0/articles/zero").send({ "article": article });
        chai.expect(res).to.have.status(403);


        user = (await fakeUserRepo.getUserById(6))._transform();
        userStub.returns(user);

        let spy = sinon.spy(fakeArticleRepo, 'editorUpdateArticle');
        res = await chai.request(app).put("/api/v0/articles/zero").send({ "article": article });
        chai.expect(res).to.have.status(200);
        chai.assert.equal(spy.calledOnce, true);
        spy.restore();
    });

    it('Test the method to update an article with admin privileges', async () => {
        statusStub.returns(true);
        let user: UserModel = (await fakeUserRepo.getUserById(8))._transform();
        userStub.returns(user);

        let spy = sinon.spy(fakeArticleRepo, 'adminUpdateArticle');
        let article: ArticleModel = new ArticleModel();
        article.id = "zero";
        article.title = "Nuovo articolo di prova";
        let res = await chai.request(app).put("/api/v0/articles/zero/admin").send({ "article": article });
        chai.expect(res).to.have.status(200);
        chai.assert.equal(spy.calledOnce, true);
        spy.restore();
    });

});