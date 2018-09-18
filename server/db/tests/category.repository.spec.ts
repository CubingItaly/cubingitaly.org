import 'mocha';
import { assert, expect } from 'chai';
import { Database } from '../database';
import { MysqlTool } from './mysql.tool';
import { getCustomRepository } from 'typeorm';
import { ArticleCategoryRepository } from '../repository/category.repository';
import { ArticleCategoryEntity } from '../entity/category.entity';


let database: Database;
let dbTool: MysqlTool;
let catRepo: ArticleCategoryRepository;


describe('Test the Category Repository', async () => {
    before(async () => {
        dbTool = new MysqlTool();
        await dbTool.prepareDatabaseToTest();
        database = new Database();
        await database.createConnection();
        await database.initDatabase();
        catRepo = getCustomRepository(ArticleCategoryRepository);
    });

    after(async () => {
        await database.closeConnection();
        await dbTool.restoreDatabaseAfterTest();
    });

    it('Test the method to get the categories', async () => {
        let categories: ArticleCategoryEntity[] = await catRepo.getCategories();
        assert.equal(categories.length, 3);

        await catRepo.InitDefaults();
        categories = await catRepo.getCategories();
        assert.equal(categories.length, 3);
    });

    it('Test the method to get a category', async () => {
        let category: ArticleCategoryEntity = await catRepo.getCategory("news");
        assert.equal(category.id, "news");
        assert.equal(category.name, "News");
        assert.equal(category.color, "#ffffff");

        category = await catRepo.getCategory("coapoj");
        assert.equal(undefined, category);
    });


});