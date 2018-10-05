import 'mocha';
import { assert } from 'chai';
import { ArticleCategoryEntity } from '../entity/category.entity';
import { ArticleCategoryModel } from '../../models/classes/category.model';


describe('It test the transform function of the category entity', () => {

    it('test the transform function', () => {
        let category: ArticleCategoryEntity = new ArticleCategoryEntity();
        category.id = "cat";
        category.name = "Cat";
        category.color = "#ffffff";

        let model: ArticleCategoryModel = category._transform();

        assert.equal(model.name, category.name);
        assert.equal(model.id, category.id);
        assert.equal(model.color, category.color);
    });

});

describe('It test the transform function of the category entity', () => {

    let model: ArticleCategoryModel;

    before(() => {
        model = new ArticleCategoryModel();
        model.id = "cat";
        model.name = "Cat";
        model.color = "#ffffff";

    });


    it('test the assimilate function', () => {
        let category: ArticleCategoryEntity = new ArticleCategoryEntity();

        category._assimilate(model);

        assert.equal(model.name, category.name);
        assert.equal(model.id, category.id);
        assert.equal(model.color, category.color);
    });

});