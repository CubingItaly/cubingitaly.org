import 'mocha';
import { assert } from 'chai';
import { ArticleCategoryEntity } from '../../../server/db/entity/category.entity';
import { ArticleCategoryModel } from '../../../server/models/classes/category.model';

describe('It test the transform function of the category', () => {

    let category: ArticleCategoryEntity;

    before(() => {
        category = new ArticleCategoryEntity();
        category.id = "citi";
        category.name = "CITI";
    });

    it('test the transform function', () => {
        let model: ArticleCategoryModel = category._transform();
        assert.equal(model.id, category.id);
        assert.equal(model.name, category.name);
    });

});

describe('It test the assimilate function of the category', () => {

    let category: ArticleCategoryModel;

    before(() => {
        category = new ArticleCategoryModel();
        category.id = "citi";
        category.name = "CITI";
    });

    it('test the transform function', () => {
        let entity: ArticleCategoryEntity = new ArticleCategoryEntity();
        entity._assimilate(category);
        assert.equal(entity.id, category.id);
        assert.equal(entity.name, category.name);
    });


});