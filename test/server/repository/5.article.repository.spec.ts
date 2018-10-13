import { assert } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';
import { ArticleRepository } from '../../../server/db/repository/article.repository';
import { getCustomRepository, UpdateDateColumn } from 'typeorm';
import { ArticleEntity } from '../../../server/db/entity/article.entity';
import { UserRepository } from '../../../server/db/repository/user.repository';
import { UserEntity } from '../../../server/db/entity/user.entity';
import { ArticleCategoryEntity } from '../../../server/db/entity/category.entity';

let db: TestDatabase;

let database: TestDatabase;
let repo: ArticleRepository
let userRepo: UserRepository;
let user: UserEntity;


describe('Test the article repo', () => {
    before(async () => {
        database = new TestDatabase();
        await database.createConnection();
        repo = getCustomRepository(ArticleRepository);
        userRepo = getCustomRepository(UserRepository);
        user = await userRepo.getUserById(397);

    });

    it('Test the method to get public articles where there is no article', async () => {
        let articles: ArticleEntity[] = await repo.getPublicArticles(10, 0);
        assert.equal(articles.length, 0);
    });

    it('Test the method to get all articles where there is no article', async () => {
        let articles: ArticleEntity[] = await repo.getAllArticles(10, 0);
        assert.equal(articles.length, 0);
    });

    let titles: { title: string, id: string }[] = [
        { title: "èç     éù", id: "ec-eu" },
        { title: "The Game", id: "the-game" },
        { title: "----Tavoli è sedìè sono bellissìmissimi --- asd -- .", id: "tavoli-e-sedie-sono-bellissimissimi-asd" },
        { title: "  ....  àèìòù  ---  __ KeK        asd", id: "aeiou-kek-asd" },
        { title: "? Kamikàze ORTU; ", id: "kamikaze-ortu" },
        { title: "<< >> <<< >>>", id: "articolo" },
        { title: "admin", id: "articolo2" },
        { title: "    àDmìN ..  _ ", id: "articolo3" },
        { title: "KeK---", id: "kek" },
        { title: "{+}", id: "articolo4" },
        { title: "44 Gàttì ìn fìlà pér trè còl rèstò _ dì dùé", id: "44-gatti-in-fila-per-tre-col-resto-di-due" },
        { title: "Il colmo --- per una ___ -- __ -??== \"!!\"\"!\\ //&()=?^£%$&!\"£$\"£$ puttana? èssere tua màdre", id: "il-colmo-per-una-puttana-essere-tua-madre" },
        { title: "	tab				 and spacè			", id: "tab-and-space" },
        { title: "çi vediamo =========== dòpo", id: "ci-vediamo-dopo" },
        { title: "https://cubingitaly.org/", id: "httpscubingitalyorg" },
        { title: "www.cubingitaly.org", id: "wwwcubingitalyorg" },
        { title: "Sondaggio importante: meglio gareggiare di domenica o di martedì?", id: "sondaggio-importante-meglio-gareggiare-di-domenica-o-di-martedi" },
        { title: "{} Topolino |||\\!\"£$%&/()=?^*§_:;,.-<>		", id: "topolino" },
        { title: "$$$%!\"£ !\"£!\"£§ §* §**_:;", id: "articolo5" },
        { title: "https://www.facebook.com/sergionep/posts/10212151071148751?comment_id=10212155057488407&comment_t2tn%22%3A%22,R%22%7D", id: "httpswwwfacebookcomsergionepposts10212151071148751commentid10212155057488407commentt2tn223a22r227d" },
        { title: "P A R A D O S S O", id: "p-a-r-a-d-o-s-s-o" },
        { title: "Su cubingitaly.org arriva la modalità Battle Royale", id: "su-cubingitalyorg-arriva-la-modalita-battle-royale" },
        { title: " articolo ", id: "articolo6" },
        { title: "L'orso Bubu", id: "lorso-bubu" },
        { title: "L'admin", id: "ladmin" }
    ];

    for (let title of titles) {
        it('Test the method to create a article', async () => {
            let article: ArticleEntity = await repo.createArticle(title.title);
            assert(article.id, title.id);
            assert(article.title, title.title);
        });
    }

    it('Count all articles', async () => {
        let count: number = await repo.countAllArticles();
        assert.equal(count, 25);
    });

    it('Count public articles in all categories', async () => {
        let count: number = await repo.countPublicArticles(null);;
        assert.equal(count, 0);
    });

    it('Test the method to get an article', async () => {
        let article: ArticleEntity = await repo.getArticleById("articolo6");
        assert.equal(article.id, "articolo6");
    });

    it('Test the method to delete an article', async () => {
        await repo.deleteArticle("articolo6");
        let count: number = await repo.countAllArticles();
        assert.equal(count, 24);
        let article: ArticleEntity = await repo.getArticleById("articolo6");
        assert.equal(article, undefined);
    });

    it('test the method to update an article', async () => {
        let article: ArticleEntity = await repo.getArticleById("articolo");
        article.title = "Test";
        article.content = "test content";
        article.summary = "summary";
        let category: ArticleCategoryEntity = new ArticleCategoryEntity();
        category.id = "news";
        category.name = "News";
        article.categories = [category];
        let updatedArticle: ArticleEntity = await repo.editorUpdateArticle(article, user);
        assert.equal(updatedArticle.lastEditor.id, user.id);
        assert.equal(updatedArticle.author, undefined);
        assert.equal(updatedArticle.title, article.title);
        assert.equal(updatedArticle.summary, article.summary);
        assert.equal(updatedArticle.content, article.content);
        assert.equal(updatedArticle.categories.length, 1);
        assert.equal(updatedArticle.categories[0].id, "news");
    });

    it('test the method to admin update an article', async () => {
        let article: ArticleEntity = await repo.getArticleById("articolo");
        article.isPublic = true;
        let updatedArticle: ArticleEntity = await repo.adminUpdateArticle(article, user);
        assert.equal(updatedArticle.isPublic, true);
        assert.equal(updatedArticle.author.id, user.id);
    });

    it('test the method to get articles by cateogory', async () => {
        let articles: ArticleEntity[] = await repo.getArticlesByCategory(10, 0, "news");
        assert.equal(articles.length, 1);
        articles = await repo.getArticlesByCategory(10, 0, "saddas");
        assert.equal(articles.length, 0);
    });

    it('test the method to get public articles', async () => {
        let articles: ArticleEntity[] = await repo.getPublicArticles(10, 0);
        assert.equal(articles.length, 1);
    })

    it('test the method to count public articles by category', async()=>{
        let count:number = await repo.countPublicArticles('news');
        assert.equal(count, 1);
        count = await repo.countPublicArticles('nasds');
        assert.equal(count, 0);
    });

    it('test the method to unpublish an article', async () => {
        let article: ArticleEntity = await repo.getArticleById("articolo");
        article.isPublic = false;
        let updatedArticle: ArticleEntity = await repo.adminUpdateArticle(article, user);
        assert.equal(updatedArticle.isPublic, false);
        assert.equal(updatedArticle.author, undefined);
    });


    after(async () => {
        await database.closeConnection();
    });
});


