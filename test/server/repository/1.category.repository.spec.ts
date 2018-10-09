import { assert } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';
import { ArticleCategoryRepository } from '../../../server/db/repository/category.repository';
import { getCustomRepository } from 'typeorm';
import { ArticleCategoryEntity } from '../../../server/db/entity/category.entity';

let database: TestDatabase;
let repo: ArticleCategoryRepository;

describe('Test the category repo', () => {
    before(async () => {
        database = new TestDatabase();
        await database.createConnection();
        repo = getCustomRepository(ArticleCategoryRepository);
    });

    it('test the method to get categories', async () => {
        let categories: ArticleCategoryEntity[] = await repo.getCategories();
        assert.equal(categories.length, 3);
        assert.equal(categories[0].id, "interviste");
        assert.equal(categories[0].name, "Interviste");
    });

    it('test the method to get a category', async () => {
        let category: ArticleCategoryEntity = await repo.getCategory('news');
        assert.equal(category.id, "news");
        assert.equal(category.name, "News");

    });

    it('test the method to get a not existing category', async () => {
        let category: ArticleCategoryEntity = await repo.getCategory('nius');
        assert.equal(category, undefined);
    });

    it('test the init method', async () => {
        await repo.InitDefaults();
        let categories: ArticleCategoryEntity[] = await repo.getCategories();
        assert.equal(categories.length, 3);
    });

    after(async () => {
        await database.closeConnection();
    })
})


