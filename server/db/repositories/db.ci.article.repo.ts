import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { DBArticleCategory } from "../entity/db.article.category";
import { DBArticle } from "../entity/db.article";
import { DBUser } from "../entity/db.user";
import { Article } from "../../models/article.model";

/**
 * Repository used to handle articles
 * 
 * @export
 * @class CIArticlesRepository
 * @extends {BaseCommonRepository<DBArticle>}
 */
@EntityRepository(DBArticle)
export class CIArticlesRepository extends BaseCommonRepository<DBArticle> {

    //Number of articles displayed in the admin page
    private adminPageLength: number = 15;
    //Number of articles displayed in public article lists
    private publicPageLength: number = 10;

    /**
     * Sets the entity identifier.
     * Sounds useful for whatever kind of reflection.
     * 
     * @type {string}
     * @memberof CITeamsRepo
     */
    public _entityIdentifier: string = "DBArticle";

    /**
     * Inits some default teams.
     * 
     * @returns {Promise<void>} 
     * @memberof CITeamsRepo
     */
    public async InitDefaults(): Promise<void> {
        return;
    }

    /**
     * Find article by id
     * 
     * @param {string} id 
     * @returns {Promise<DBArticle>} 
     * @memberof CIArticlesRepository
     */
    public async findArticleById(id: string): Promise<DBArticle> {
        return await this.repository.findOneById(id);
    }

    /**
     * Find the list of all the public article belonging to the given page
     * 
     * @param {number} page 
     * @returns {Promise<DBArticle[]>} 
     * @memberof CIArticlesRepository
     */
    public async findPublicArticles(page: number): Promise<DBArticle[]> {
        return await this.repository.createQueryBuilder("article")
            .innerJoinAndSelect("article.author", "author")
            .leftJoinAndSelect("article.categories", "categories")
            .where("article.isPublic=1")
            .orderBy("article.creationDate", "DESC")
            .take(this.publicPageLength)
            .skip(this.publicPageLength * page)
            .getMany();
    }

    /**
     * Find the list of all the articles belonging to the given page, both public and hidden
     * 
     * @param {number} page 
     * @returns {Promise<DBArticle[]>} 
     * @memberof CIArticlesRepository
     */
    public async findAllArticles(page: number): Promise<DBArticle[]> {
        return await this.repository.createQueryBuilder("article")
            .innerJoin("article.author", "author")
            .leftJoin("article.categories", "categories")
            .select(["article.id", "article.title", "article.isPublic", "article.creationDate", "article.updateDate", "author.name", "author.id", "categories.id", "categories.name"])
            .orderBy("article.updateDate", "DESC")
            .take(this.adminPageLength)
            .skip(this.adminPageLength * page)
            .getMany();
    }

    /**
     * Count the total number of public articles
     * 
     * @returns {Promise<number>} 
     * @memberof CIArticlesRepository
     */
    public async countPublicArticles(): Promise<number> {
        return (await
            this.repository.createQueryBuilder("articles")
                .where("isPublic = true")
                .getMany()
        ).length;
    }

    /**
     * Count the total number of articles, both public and hidden
     * 
     * @returns {Promise<number>} 
     * @memberof CIArticlesRepository
     */
    public async countAllArticles(): Promise<number> {
        return (await this.repository.find()).length;
    }

    /**
     * Checks whether an article exists
     * 
     * @param {string} id 
     * @returns {Promise<boolean>} 
     * @memberof CIArticlesRepository
     */
    public async checkIfArticleExists(id: string): Promise<boolean> {
        let articles: DBArticle[] = await this.repository.find({ id: id });
        if (articles.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Create an article, if it already exists return false
     * 
     * @param {DBArticle} article 
     * @returns {Promise<DBArticle>} 
     * @memberof CIArticlesRepository
     */
    public async createArticle(article: DBArticle): Promise<DBArticle> {
        //if the article already has an id, return
        if (article.id) {
            return;
        }
        article.id = this.generateArticleId(article.title);
        //if an article with this id already exists, return
        let articleExists: boolean = await this.checkIfArticleExists(article.id);
        if (articleExists) {
            return;
        }
        article.isPublic = false;
        return await this.repository.save(article);
    }

    /**
     * Update an article
     * 
     * @param {DBArticle} article 
     * @returns {Promise<DBArticle>} 
     * @memberof CIArticlesRepository
     */
    public async updateArticle(article: DBArticle): Promise<DBArticle> {
        let db_article: DBArticle = await this.findArticleById(article.id);
        article = this.updateOnlyRelevantColumns(db_article, article);
        return await this.repository.save(article);
    }

    /**
     * Private method used to update only relevant column of an article
     * e.g. not those relevant to the status or to the author
     * 
     * @private
     * @param {DBArticle} old_article 
     * @param {DBArticle} new_article 
     * @returns 
     * @memberof CIArticlesRepository
     */
    private updateOnlyRelevantColumns(old_article: DBArticle, new_article: DBArticle) {
        new_article.author = old_article.author;
        new_article.isPublic = old_article.isPublic;
        return new_article;
    }

    /**
     * Publish an article and update the author
     * 
     * @param {string} id 
     * @param {DBUser} user 
     * @returns {Promise<DBArticle>} 
     * @memberof CIArticlesRepository
     */
    public async publishArticle(id: string, user: DBUser): Promise<DBArticle> {
        let article: DBArticle = await this.findArticleById(id);
        article.isPublic = true;
        article.author = user;
        return await this.repository.save(article);
    }

    /**
     * Make hidden an article
     * 
     * @param {string} id 
     * @returns {Promise<DBArticle>} 
     * @memberof CIArticlesRepository
     */
    public async unpublishArticle(id: string): Promise<DBArticle> {
        let article: DBArticle = await this.findArticleById(id);
        article.isPublic = false;
        return await this.repository.save(article);
    }

    /**
     * Checks wether an article is public
     * 
     * @param {string} id 
     * @returns {Promise<boolean>} 
     * @memberof CIArticlesRepository
     */
    public async isArticlePublic(id: string): Promise<boolean> {
        let articles: DBArticle[] = await this.repository.find({ id: id, isPublic: true });
        return articles.length > 0;
    }

    /**
     * Delete an existing article
     * 
     * @param {string} id 
     * @returns {Promise<void>} 
     * @memberof CIArticlesRepository
     */
    public async deleteArticle(id: string): Promise<void> {
        let article: DBArticle = await this.findArticleById(id);
        article.categories = [];
        await this.repository.save(article);
        return await this.repository.removeById(article);
    }

    /**
     * Generate the article id starting from the title
     * 
     * @private
     * @param {string} title 
     * @returns {string} 
     * @memberof CIArticlesRepository
     */
    private generateArticleId(title: string): string {
        let id: string = title;
        //remove spaces at the start or at the end of the id
        id = id.trim();
        //replace spaces with -
        id = id.split(' ').join('-');
        id = id.toLowerCase();

        id = id.replace(/([à])/g, "a");
        id = id.replace(/([è])/g, "e");
        id = id.replace(/([ì])/g, "i");
        id = id.replace(/([ò])/g, "o");
        id = id.replace(/([ù])/g, "u");

        //replace all chars that are not a-z, 0-9 or '-'
        id = id.replace(/([^a-z0-9-])/g, "");

        return id;
    }

}