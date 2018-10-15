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
        return this.repository.find({ select: ["id", "title", "summary", "publishDate", "updateDate"], relations: ["author", "lastEditor"], where: { isPublic: true }, order: { publishDate: "DESC" }, take: limit, skip: page * limit });
    }

    /**
     * Returns the number of published articles
     *
     * @returns {Promise<number>}
     * @memberof ArticleRepository
     */
    public async countPublicArticles(category: string): Promise<number> {
        if (category) {
            return this.repository.createQueryBuilder("article")
                .innerJoin("article.categories","category")
                .where("category.id = :category and article.isPublic = :isPublic", {category:category, isPublic:true})
                .getCount();
        }
        return this.repository.count({ where: { isPublic: true } });
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
        return this.repository.find({ select: ["id", "title", "isPublic", "summary", "publishDate", "updateDate"], relations: ["author", "lastEditor"], order: { updateDate: "DESC" }, take: limit, skip: limit * page });
    }

    /**
     * Returns total number of articles in the database
     *
     * @returns {Promise<number>}
     * @memberof ArticleRepository
     */
    public async countAllArticles(): Promise<number> {
        return this.repository.count();
    }

    /**
     * Return a list of public articles belonging to the specified category.
     * You can choose the number of articles and the offset by specifying the limit and the page number
     * 
     * @param limit 
     * @param page 
     * @param category 
     */
    public async getArticlesByCategory(limit: number, page: number, category: string): Promise<ArticleEntity[]> {
        return this.repository.createQueryBuilder("article")
            .innerJoinAndSelect("article.categories", "cat")
            .innerJoinAndSelect("article.author", "author")
            .innerJoinAndSelect("article.lastEditor", "editor")
            .where("cat.id = :category and article.isPublic = :public", { category: category, public: true })
            .orderBy("article.publishDate", "DESC")
            .take(limit).skip(limit * page).getMany();
    }


    /**
     * Returns true if an article exists with the id passed as a parameter
     *
     * @param {string} id
     * @returns {Promise<boolean>}
     * @memberof ArticleRepository
     */
    public async checkIfArticleExists(id: string): Promise<boolean> {
        let count: number= await this.repository.count({where: {id:id}});
        return count > 0;
    }

    /**
     * Returns an article with the associated categories
     *
     * @param {string} id
     * @returns {Promise<ArticleEntity>}
     * @memberof ArticleRepository
     */
    public async getArticleById(id: string): Promise<ArticleEntity> {
        return this.repository.findOne(id, { relations: ["lastEditor", "author"] });
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
        return this.repository.save(oldArticle);
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
        return this.repository.save(oldArticle);
    }

    /**
     * Creates an article with only id and title
     * 
     * @param title 
     */
    public async createArticle(title: string): Promise<ArticleEntity> {
        let id: string = await this.generateId(title);
        let article: ArticleEntity = new ArticleEntity();
        article.id = id;
        article.title = title;
        return this.repository.save(article);
    }

    /**
     * Generates an id for a new article.
     * If the candidate id already exists, adds an index after the id.
     * 
     * @param title 
     */
    private async generateId(title: string): Promise<string> {
        let id: string = this.generateArticleId(title);
        let exists: boolean;
        do {
            exists = await this.checkIfArticleExists(id);
            if (!exists) {
                return id;
            } else {
                let count: number = await this.countArticleIdsLike(id);
                id += count + 1;
            }
        } while (exists);
    }

    /**
     * Cleans the title to generate a candidate id.
     * 
     * @param title 
     */
    private generateArticleId(title: string): string {
        let id: string = title;

        //replace spaces with -
        id = id.split(' ').join('-');
        id = id.toLowerCase();

        id = id.replace(/([à])/g, "a");
        id = id.replace(/([èé])/g, "e");
        id = id.replace(/([ì])/g, "i");
        id = id.replace(/([ò])/g, "o");
        id = id.replace(/([ù])/g, "u");
        id = id.replace(/([ç])/g, "c");

        //replace all chars that are not a-z, 0-9 or '-'
        id = id.replace(/([^a-z0-9-])/g, "");

        id = id.replace(/(-)+/g, "-");

        //if the id starts or ends with one or more '-' remove them
        while (id.startsWith("-")) {
            id = id.substr(1);
        }
        while (id.endsWith("-")) {
            id = id.substr(0, id.length - 1);
        }

        // every article must have an id and "admin","list" and "new" are forbidden article ids
        if (id === "" || id === "admin" || id === "list" || id === "new" || id === "categorie" || id === "edit") id = "articolo";
        return id;
    }

    /**
     * Counts the number of ids that are like the candidate one.
     * 
     * @param id 
     */
    private async countArticleIdsLike(id: string): Promise<number> {
        return this.repository.count({ id: Like(id + "%") });
    }

}