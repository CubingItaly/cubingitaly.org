import 'mocha';
import { assert, expect } from 'chai';
import { ArticleModel } from '../../models/classes/article.model';
import { UserModel } from '../../models/classes/user.model';
import { ArticleEntity } from '../entity/article.entity';
import { ArticleCategoryModel } from '../../models/classes/category.model';
import { UserEntity } from '../entity/user.entity';
import { ArticleCategoryEntity } from '../entity/category.entity';


describe('Test the assimilate function of an Article Entity', () => {
    let model: ArticleModel;


    beforeEach(() => {
        model = new ArticleModel();
        model.id = "id";
        model.title = "title";
        model.summary = "summary";
        model.content = "content";
        model.isPublic = true;

    });

    it('Test the function when all the parameters are available, no categories', () => {
        model.categories = [];

        let author = new UserModel();
        author.id = 1;
        model.lastEditor = author;
        model.author = author;

        model.updateDate = new Date();
        model.publishDate = new Date();

        let article: ArticleEntity = new ArticleEntity();
        article._assimilate(model);
        assert.equal(model.id, article.id);
        assert.equal(model.title, article.title);
        assert.equal(model.content, article.content);
        assert.equal(model.summary, article.summary);
        assert.equal(model.publishDate, article.publishDate);
        assert.equal(model.updateDate, article.updateDate);
        assert.equal(model.isPublic, article.isPublic);
        assert.equal(model.author.id, article.author.id);
        assert.equal(model.lastEditor.id, article.lastEditor.id);
        assert.equal(0, article.categories.length);
    });


    it('Test the function when there is one category and no authors ', () => {

        let category: ArticleCategoryModel = new ArticleCategoryModel();
        category.id = "cat";
        category.name = "cat";
        category.color = "#000000";
        model.categories = [category];
        model.isPublic = undefined;
        let article: ArticleEntity = new ArticleEntity();
        article._assimilate(model);

        assert.equal(1, article.categories.length);
        assert.equal(article.categories[0].name, "cat");

        assert.equal(false, article.isPublic);
        assert.equal(undefined, article.author);
        assert.equal(undefined, article.lastEditor);
        assert.equal(undefined, article.updateDate);
        assert.equal(undefined, article.publishDate);
    })
});

describe('It test the transform method of the ArticleEntity', () => {



    it('Test the method when everything is set', () => {
        let article: ArticleEntity = new ArticleEntity();

        article.id = "id";
        article.title = "title";
        article.content = "con";
        article.summary = "sum";
        article.isPublic = true;

        let author = new UserEntity();
        author.id = 1;

        article.lastEditor = author;
        article.author = author;
        article.publishDate = new Date();
        article.updateDate = new Date();

        let category = new ArticleCategoryEntity();
        category.id = "cat";
        category.name = "cat";
        category.color = "#000000";
        article.categories = [category];

        let model: ArticleModel = article._transform();


        assert.equal(article.id, model.id);
        assert.equal(article.summary, model.summary);
        assert.equal(article.content, model.content);
        assert.equal(article.title, model.title);
        assert.equal(article.isPublic, model.isPublic);
        assert.equal(article.author.id, model.author.id);
        assert.equal(article.lastEditor.id, model.lastEditor.id);
        assert.equal(article.updateDate, model.updateDate);
        assert.equal(article.publishDate, model.publishDate);
        assert.equal(article.categories.length, 1);


    });

    it('', () => {
        let article: ArticleEntity = new ArticleEntity();
        let model: ArticleModel = article._transform();


        assert.equal(undefined, model.id);
        assert.equal(undefined, model.title);
        assert.equal(undefined, model.content);
        assert.equal(undefined, model.summary);
        assert.equal(undefined, model.isPublic);
        assert.equal(undefined, model.publishDate);
        assert.equal(undefined, model.updateDate);
        assert.equal(undefined, model.author);
        assert.equal(undefined, model.lastEditor);
        assert.equal(0, model.categories.length);
    });
});
