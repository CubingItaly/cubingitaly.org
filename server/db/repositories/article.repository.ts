import { BaseCommonRepository } from "../BaseCommonRepository";
import { EntityRepository, Like } from "typeorm";
import { ArticleEntity } from "../entity/article.entity";
import { UserEntity } from "../entity/user.entity";


@EntityRepository(ArticleEntity)
export class ArticleRepository extends BaseCommonRepository<ArticleEntity> {


    public _entityIdentifier: string = "ArticleEntity";



    public async InitDefaults(): Promise<void> {
        return;
    }

    /**
     * Returns the list of all the public articles sorted by publish date, descending.
     * You can choose the number of articles and the offset by specifying the limit and the page number
     *
     * @returns {Promise<ArticleEntity[]>}
     * @memberof ArticleRepository
     */
    public async getPublicArticles(limit: number, page: number): Promise<ArticleEntity[]> {
        return this.repository.find();
    }

    /**
     * Returns the number of published articles
     *
     * @returns {Promise<number>}
     * @memberof ArticleRepository
     */
    public async countPublicArticles(): Promise<number> {
        return await this.repository.count({ where: { isPublic: true } });
    }

    /**
     * Returns the list of all the articles, including the non published. Articles are sorted by update date, descending.
     * You can choose the number of articles and the offset by specifying the limit and the page number
     *
     * @param {number} limit
     * @param {number} page
     * @returns {Promise<ArticleEntity[]>}
     * @memberof ArticleRepository
     */
    public async getAllArticles(limit: number, page: number): Promise<ArticleEntity[]> {
        return this.repository.find({ order: { updateDate: "DESC" }, take: limit, skip: limit * page });
    }

    /**
     * Returns total number of articles in the database
     *
     * @returns {Promise<number>}
     * @memberof ArticleRepository
     */
    public async countAllArticles(): Promise<number> {
        return await this.repository.count();
    }

    /**
     * Returns true if an article exists with the id passed as a parameter
     *
     * @param {string} id
     * @returns {Promise<boolean>}
     * @memberof ArticleRepository
     */
    public async checkIfArticleExists(id: string): Promise<boolean> {
        let article: ArticleEntity = await this.repository.findOne(id);
        return (article !== undefined && article !== null);
    }

    /**
     * Returns an article with the associated categories
     *
     * @param {string} id
     * @returns {Promise<ArticleEntity>}
     * @memberof ArticleRepository
     */
    public async getArticleById(id: string): Promise<ArticleEntity> {
        return await this.repository.findOne(id, { relations: ["categories"] });
    }

    /**
     *Deletes an article from the database
     *
     * @param {string} id
     * @returns {Promise<void>}
     * @memberof ArticleRepository
     */
    public async deleteArticle(id: string): Promise<void> {
        let article: ArticleEntity = await this.repository.findOne(id);
        await this.repository.remove(article);
        return;
    }

    /**
     * Update an article.
     * Allows to edit only information that editors can change
     *
     * @param {ArticleEntity} article
     * @param {UserEntity} user
     * @returns {Promise<ArticleEntity>}
     * @memberof ArticleRepository
     */
    public async editorUpdateArticle(article: ArticleEntity, user: UserEntity): Promise<ArticleEntity> {
        let oldArticle: ArticleEntity = await this.getArticleById(article.id);
        oldArticle.title = article.title;
        oldArticle.summary = article.summary;
        oldArticle.content = article.content;
        oldArticle.lastEditor = user;
        oldArticle.categories = article.categories;
        return await this.repository.save(oldArticle);
    }

    /**
     * Updates an article.
     * Allows to change all the information, except for the id.
     * It can also be used to publish/unpublish the article.
     *
     * @param {ArticleEntity} article
     * @param {UserEntity} user
     * @returns {Promise<ArticleEntity>}
     * @memberof ArticleRepository
     */
    public async adminUpdateArticle(article: ArticleEntity, user: UserEntity): Promise<ArticleEntity> {
        /** Update less privileged content */
        let oldArticle: ArticleEntity = await this.editorUpdateArticle(article, user);

        if (oldArticle.isPublic !== article.isPublic) {
            oldArticle.isPublic = !oldArticle.isPublic;
            if (oldArticle.isPublic) {
                oldArticle.publishDate = new Date();
                oldArticle.author = user;
            } else {
                oldArticle.publishDate = null;
                oldArticle.author = null;
            }
        }
        return await this.repository.save(oldArticle);
    }

    public async createArticle(title: string): Promise<ArticleEntity> {
        let id: string = await this.generateId(title);
        let article: ArticleEntity = new ArticleEntity();
        article.id = id;
        article.title = title;
        return await this.repository.save(article);
    }

    private async generateId(title: string): Promise<string> {
        let id: string = this.generateArticleId(title);
        let exists: boolean;
        do {
            exists = await this.checkIfArticleExists(id);
            if (!exists) {
                return id;
            } else {
                let count: number = await this.countArticleIdsLike(id);
                id += count;
            }
        } while (exists);
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

    private async countArticleIdsLike(id: string): Promise<number> {
        let count: number = await this.repository.count({ id: Like(id + "%") });
        return count;
    }

}