import { assert, expect } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';
import { PageRepository } from '../../../server/db/repository/page.repository';
import { getCustomRepository, UpdateDateColumn } from 'typeorm';
import { PageEntity } from '../../../server/db/entity/page.entity';
import { UserRepository } from '../../../server/db/repository/user.repository';
import { UserEntity } from '../../../server/db/entity/user.entity';
import { TutorialEntity } from '../../../server/db/entity/tutorial.entity';

let db: TestDatabase;

let database: TestDatabase;
let repo: PageRepository
let userRepo: UserRepository;
let user: UserEntity;


describe('Test the page repo', () => {
    before(async () => {
        database = new TestDatabase();
        await database.createConnection();
        repo = getCustomRepository(PageRepository);
        userRepo = getCustomRepository(UserRepository);
        user = await userRepo.getUserById(397);
    });

    it('test the method to get a page and init method', async () => {
        let page: PageEntity = await repo.getPage(1);
        assert.equal(page.title, "Riguardo Cubing Italy");
        assert.equal(page.author, undefined);
        assert.equal(page.lastEditor, undefined);
        page = await repo.getPage(100);
        assert.equal(page.title, "Reserved");
        page = await repo.getPage(101);
        assert.equal(page, undefined);
    });

    it('test the method to get an admin page', async () => {
        let page: PageEntity = await repo.adminGetPage(1);
        assert.equal(page.title, "Riguardo Cubing Italy");
        assert.equal(page.author.id, 0);
        assert.equal(page.lastEditor.id, 0);

        page = await repo.getPage(101);
        assert.equal(page, undefined);
    });

    it('Test the method to check if an article exists', async () => {
        let exist: boolean = await repo.checkIfPageExists(2);
        assert.equal(exist, true);
        exist = await repo.checkIfPageExists(202);
        assert.equal(exist, false);
    });

    it('Test the method to update a page', async () => {
        let page: PageEntity = await repo.adminGetPage(1);
        let copy: PageEntity = page;
        copy.title = "title";
        copy.content = "content";
        copy.indexInTutorial = 2;
        copy.isPublic = false;
        copy.author = user;
        copy.createDate = new Date();
        copy.tutorial = new TutorialEntity();
        let update: PageEntity = await repo.updatePage(copy, user);
        expect(update.title).to.be.equal(copy.title);
        expect(update.content).to.be.equal(copy.content);
        assert.notEqual(update.updateDate, page.updateDate);
        assert.equal(update.lastEditor.id, user.id);
        assert.equal(update.author.id, 0);
        assert.equal(update.lastEditor.id, user.id);
        assert.equal(update.tutorial, undefined);
        assert.equal(update.indexInTutorial, -1);
        assert.equal(update.isPublic, true);
    });

    it('Test the method to admin update a page', async () => {
        let page: PageEntity = await repo.adminGetPage(1);
        let copy: PageEntity = page;
        copy.title = "new title";
        copy.content = "new content";
        copy.indexInTutorial = 2;
        copy.isPublic = false;
        let update: PageEntity = await repo.adminUpdatePage(copy, user);
        expect(update.title).to.be.equal(copy.title);
        expect(update.content).to.be.equal(copy.content);
        assert.equal(update.lastEditor.id, user.id);
        assert.equal(update.author.id, 0);
        assert.equal(update.lastEditor.id, user.id);
        assert.equal(update.indexInTutorial, 2);
        assert.equal(update.isPublic, false);
    });

    it('Creates a page', async () => {
        let exist: boolean = await repo.checkIfPageExists(101);
        assert.equal(exist, false);
        let page: PageEntity = new PageEntity();
        page.title = "test";
        page.content = "content";
        page.isPublic = false;
        page.indexInTutorial = -1;
        let newPage: PageEntity = await repo.createPage(page, user);
        assert.equal(newPage.id, 101);
        assert.equal(newPage.lastEditor.id, user.id);
        assert.equal(newPage.title, page.title);
        assert.equal(newPage.content, page.content);
        assert.equal(newPage.indexInTutorial, page.indexInTutorial);
        assert.equal(newPage.isPublic, page.isPublic);
    });

    it('Test the method to delete a page', async () => {
        let exist: boolean = await repo.checkIfPageExists(100);
        assert.equal(exist, true);
        await repo.deletePage(100);
        exist = await repo.checkIfPageExists(100);
        assert.equal(exist, false);
        await repo.deletePage(100);
        exist = await repo.checkIfPageExists(100);
        assert.equal(exist, false);
    });

    it('Test the method to get pages', async () => {
        let page: PageEntity[] = await repo.getPages(10, 0);
        assert.equal(page.length, 10);
        assert.equal(page[0].id, 101);
    });

    it('Tries to admin update a page that doesn\'texist', async () => {
        let page: PageEntity = new PageEntity();
        page.title = "test";
        page.content = "content";
        page.isPublic = false;
        page.indexInTutorial = -1;
        page = await repo.adminUpdatePage(page, user);
        assert.equal(page.id, 102);
    });

    after(async () => {
        await database.closeConnection();
    });
});


