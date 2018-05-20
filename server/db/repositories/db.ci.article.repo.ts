import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository } from "typeorm";
import { DBArticleCategory } from "../entity/db.article.category";
import { DBArticle } from "../entity/db.article";
import { DBUser } from "../entity/db.user";
import { Article } from "../../models/article.model";

@EntityRepository(DBArticle)
export class CIArticlesRepository extends BaseCommonRepository<DBArticle> {

    private adminPageLength: number = 15;
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

    public async findArticleById(id: string): Promise<DBArticle> {
        return await this.repository.findOneById(id);
    }

    public async findArticlesByCategory(category: DBArticleCategory): Promise<DBArticle[]> {
        return await this.repository.createQueryBuilder("article")
            .innerJoinAndSelect("article.categories", "category")
            .where("category.id = :id", { id: category.id })
            .orderBy("article.creationDate", "DESC")
            .getMany();
    }

    public async findArticlesByAuthor(author: DBUser): Promise<DBArticle[]> {
        return await this.repository.createQueryBuilder("article")
            .innerJoinAndSelect("article.author", "author")
            .where("author.id = :id", { id: author.id })
            .orderBy("article.creationDate", "DESC")
            .getMany();
    }

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

    public async countPublicArticles(): Promise<number> {
        return (await
            this.repository.createQueryBuilder("articles")
                .where("isPublic = true")
                .getMany()
        ).length;
    }

    public async countAllArticles(): Promise<number> {
        return (await this.repository.find()).length;
    }

    public async checkIfArticleExists(id: string): Promise<boolean> {
        let articles: DBArticle[] = await this.repository.find({ id: id });
        if (articles.length > 0) {
            return true;
        }
        return false;
    }

    public async createArticle(article: DBArticle): Promise<DBArticle> {
        if (article.id) {
            return;
        }
        article.id = this.generateArticleId(article.title);
        return await this.repository.save(article);
    }

    public async updateArticle(article: DBArticle): Promise<DBArticle> {
        let db_article: DBArticle = await this.findArticleById(article.id);
        article = this.updateOnlyRelevantColumns(db_article, article);
        return await this.repository.save(article);
    }

    private updateOnlyRelevantColumns(old_article: DBArticle, new_article: DBArticle) {
        new_article.author = old_article.author;
        new_article.isPublic = old_article.isPublic;
        return new_article;
    }

    public async publishArticle(id: string, user: DBUser): Promise<DBArticle> {
        let article: DBArticle = await this.findArticleById(id);
        article.isPublic = true;
        article.author = user;
        return await this.repository.save(article);
    }

    public async unpublishArticle(id: string): Promise<DBArticle> {
        let article: DBArticle = await this.findArticleById(id);
        article.isPublic = false;
        return await this.repository.save(article);
    }

    public async isArticlePublic(id: string): Promise<boolean> {
        let articles: DBArticle[] = await this.repository.find({ id: id, isPublic: true });
        return articles.length > 0;
    }

    public async deleteArticle(id: string): Promise<void> {
        let article: DBArticle = await this.findArticleById(id);
        article.categories = [];
        await this.repository.save(article);
        return await this.repository.removeById(article);
    }

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