import 'mocha';
import { assert, expect } from 'chai';
import { Database } from '../database';
import { MysqlTool } from './mysql.tool';
import { getCustomRepository } from 'typeorm';
import { ArticleRepository } from '../repository/article.repository';
import { ArticleEntity } from '../entity/article.entity';
import { UserRepository } from '../repository/user.repository';
import { UserEntity } from '../entity/user.entity';
import { ArticleCategoryEntity } from '../entity/category.entity';
import { ArticleCategoryRepository } from '../repository/category.repository';


let database: Database;
let dbTool: MysqlTool;
let articleRepo: ArticleRepository;
let userRepo: UserRepository;

describe('Test the Article Repository', async () => {
    before(async () => {
        dbTool = new MysqlTool();
        await dbTool.prepareDatabaseToTest();
        database = new Database();
        await database.createConnection();
        await database.initDatabase();
        articleRepo = getCustomRepository(ArticleRepository);
        userRepo = getCustomRepository(UserRepository);

        // create some users used for tests
        let user: UserEntity = new UserEntity();
        user.id = 1;
        user.name = "Test Name";
        userRepo.updateUser(user);

        user = new UserEntity();
        user.id = 2;
        user.name = "Test Name";
        userRepo.updateUser(user);
    });

    after(async () => {
        await database.closeConnection();
        await dbTool.restoreDatabaseAfterTest();
    });

    it('Test the method to get and count all the public articles when there is no article', async () => {
        let articles: ArticleEntity[] = await articleRepo.getPublicArticles(0, 10);
        assert.equal(articles.length, 0);
        let count: number = await articleRepo.countPublicArticles();
        assert.equal(count, 0);
    });

    it('Test the method to get and count all the articles when there is no article', async () => {
        let articles: ArticleEntity[] = await articleRepo.getAllArticles(0, 10);
        assert.equal(articles.length, 0);
        let count: number = await articleRepo.countAllArticles();
        assert.equal(count, 0);
    });

    it('Test the method to check if an article exist when it doesn\'t', async () => {
        let exist: boolean = await articleRepo.checkIfArticleExists("test");
        assert.equal(exist, false);
    });

    it('Test the method get an article when it doesn\'t exist', async () => {
        let article: ArticleEntity = await articleRepo.getArticleById("test");
        assert.equal(article, null);
    });

    it('Test the method to create article', async () => {
        let article: ArticleEntity = await articleRepo.createArticle(" . Articolò Di Prova! ");
        assert.equal(article.id, "articolo-di-prova");
        assert.equal(article.title, " . Articolò Di Prova! ");

        article = await articleRepo.createArticle(" - Nuovo-Articolo - ");
        assert.equal(article.id, "nuovo-articolo");
        assert.equal(article.title, " - Nuovo-Articolo - ");

        article = await articleRepo.createArticle(".£$%£&/%£/");
        assert.equal(article.id, "articolo");
        assert.equal(article.title, ".£$%£&/%£/");
    })

    it('Test the method to get an existing article', async () => {
        let article: ArticleEntity = await articleRepo.getArticleById("articolo-di-prova");
        assert.equal(article.id, "articolo-di-prova");
        assert.equal(article.title, " . Articolò Di Prova! ")
    });

    it('Test the method to create an article when the id would already exist', async () => {
        let article: ArticleEntity = await articleRepo.createArticle(" . Articolo Di Prova! ");
        assert.equal(article.id, "articolo-di-prova2");
        assert.equal(article.title, " . Articolo Di Prova! ");

        article = await articleRepo.createArticle(" . Articolo Dì Prova! ");
        assert.equal(article.id, "articolo-di-prova3");
        assert.equal(article.title, " . Articolo Dì Prova! ");
    });

    it('Test the method to count all the articles when there are 4 private and 0 public', async () => {
        let count: number = await articleRepo.countPublicArticles();
        assert.equal(0, count);
        count = await articleRepo.countAllArticles();
        assert.equal(5, count);
    });

    it('Test the method to delete an article', async () => {
        await articleRepo.deleteArticle('articolo-di-prova');
        let count: number = await articleRepo.countAllArticles();
        assert.equal(4, count);
    });

    it('Test the method to update an article with editor permissions', async () => {
        let user: UserEntity = await userRepo.getShortUserById(1);

        let article: ArticleEntity = await articleRepo.getArticleById('articolo-di-prova2');

        article.title = "Prova";
        article.summary = "riassunto";
        article.content = "contenuto";
        //this should not be updated with these permissions
        article.isPublic = true;

        let category: ArticleCategoryEntity = await (getCustomRepository(ArticleCategoryRepository)).getCategory("news");
        article.categories = [category];

        article = await articleRepo.editorUpdateArticle(article, user);

        assert.equal(article.id, "articolo-di-prova2");
        assert.equal(article.isPublic, false);
        assert.equal(article.summary, "riassunto");
        assert.equal(article.title, "Prova");
        assert.equal(article.content, "contenuto");
        assert.equal(article.categories.length, 1);
        assert.equal(article.publishDate, undefined);
        assert.equal(article.author, undefined);

        //remove categories
        article.categories = [];
        article = await articleRepo.editorUpdateArticle(article, user);
        assert.equal(article.categories.length, 0);

    });

    it('Test the method to update an article with admin permissions', async () => {
        let user: UserEntity = await userRepo.getShortUserById(2);
        let article: ArticleEntity = await articleRepo.getArticleById('articolo-di-prova2');

        article.isPublic = true;
        article = await articleRepo.adminUpdateArticle(article, user);

        assert.equal(article.isPublic, true);
        assert.equal(article.author.id, 2);
        assert.isDefined(article.publishDate);
        assert.equal(article.lastEditor.id, 2);

        user = await userRepo.getShortUserById(1);
        article = await articleRepo.adminUpdateArticle(article, user);
        assert.equal(article.author.id, 2);

        article.isPublic = false;
        article = await articleRepo.adminUpdateArticle(article, user);

        assert.equal(article.isPublic, false);
        assert.equal(article.author, undefined);
        assert.equal(article.publishDate, undefined);
        assert.equal(article.lastEditor.id, 1);

    });

    it('Test the method to get articles by category', async () => {
        let article: ArticleEntity = await articleRepo.getArticleById("articolo");
        let category: ArticleCategoryEntity = await (getCustomRepository(ArticleCategoryRepository)).getCategory("news");
        article.categories = [category];
        let user: UserEntity = await userRepo.getShortUserById(1);

        article.isPublic = true;

        await articleRepo.adminUpdateArticle(article, user);

        let articles: ArticleEntity[] = await articleRepo.getArticlesByCategory(10, 0, "news");
        assert.equal(articles.length, 1);
        assert.equal(articles[0].categories[0].id, "news");
    });

    it('Test the function to generate ids', async () => {
        let titles: { title: string, id: string }[] = [
            { title: "èç     éù", id: "ec-eu"},
            { title:"The Game",id:"the-game"},
            { title:"----Tavoli è sedìè sono bellissìmissimi --- asd -- .",id:"tavoli-e-sedie-sono-bellissimissimi-asd"},
            { title:"  ....  àèìòù  ---  __ KeK        asd",id:"aeiou-kek-asd"},
            { title:"? Kamikàze ORTU; ",id:"kamikaze-ortu"},
            { title:"<< >> <<< >>>",id:"articolo4"},
            { title:"admin",id:"articolo5"},
            { title:"    àDmìN ..  _ ",id:"articolo6"},
            { title:"KeK---",id:"kek"},
            { title:"{+}",id:"articolo7"},
            { title:"44 Gàttì ìn fìlà pér trè còl rèstò _ dì dùé",id:"44-gatti-in-fila-per-tre-col-resto-di-due"},
            { title:"Il colmo --- per una ___ -- __ -??== \"!!\"\"!\\ //&()=?^£%$&!\"£$\"£$ puttana? èssere tua màdre",id:"il-colmo-per-una-puttana-essere-tua-madre"},
            { title:"	tab				 and spacè			",id:"tab-and-space"},
            { title:"çi vediamo =========== dòpo",id:"ci-vediamo-dopo"},
            { title:"https://cubingitaly.org/",id:"httpscubingitalyorg"},
            { title:"www.cubingitaly.org",id:"wwwcubingitalyorg"},
            { title:"Sondaggio importante: meglio gareggiare di domenica o di martedì?",id:"sondaggio-importante-meglio-gareggiare-di-domenica-o-di-martedi"},
            { title:"{} Topolino |||\\!\"£$%&/()=?^*§_:;,.-<>		",id:"topolino"},
            { title:"$$$%!\"£ !\"£!\"£§ §* §**_:;",id:"articolo8"},
            { title:"https://www.facebook.com/sergionep/posts/10212151071148751?comment_id=10212155057488407&comment_t2tn%22%3A%22,R%22%7D",id:"httpswwwfacebookcomsergionepposts10212151071148751commentid10212155057488407commentt2tn223a22r227d"},
            { title:"P A R A D O S S O",id:"p-a-r-a-d-o-s-s-o"},
            { title:"Su cubingitaly.org arriva la modalità Battle Royale",id:"su-cubingitalyorg-arriva-la-modalita-battle-royale"},
            { title:" articolo ",id:"articolo9"},
            { title:"",id:"articolo10"},
            { title:"L'orso Bubu",id:"lorso-bubu"},
            { title:"L'admin",id:"ladmin"}
        ];

        let article: ArticleEntity;

        for (const t of titles) {
            article = await articleRepo.createArticle(t.title);
            assert.equal(article.id, t.id);
        }
    });
});