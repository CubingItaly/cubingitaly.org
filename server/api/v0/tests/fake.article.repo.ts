import { ArticleRepository } from "../../../db/repository/article.repository";
import { ArticleEntity } from "../../../db/entity/article.entity";
import { UserEntity } from "../../../db/entity/user.entity";

export class FakeArticleRepo extends ArticleRepository {

    private articles: {
        id: string, title: string,
        content: string, summary: string,
        publishDate: Date, updateDate: Date,
        isPublic: boolean, author: number,
        lastEditor: number, categories: string[]
    }[] = [
            {
                id: "zero", title: "Zero", content: null, summary: null, publishDate: null, updateDate: null, author: null, lastEditor: null, isPublic: false, categories: []
            },
            {
                id: "one", title: "One", content: "prova", summary: "prova", publishDate: null, updateDate: null, author: null, lastEditor: null, isPublic: false, categories: []
            },
            {
                id: "two", title: "Two", content: "prova", summary: "prova", publishDate: null, updateDate: null, author: null, lastEditor: null, isPublic: true, categories: []
            }
        ];

    public async getArticleById(id: string): Promise<ArticleEntity> {
        let article: ArticleEntity = new ArticleEntity();
        let tmp = this.articles.find(a => a.id === id);
        if (tmp === undefined) return;
        article.id = tmp.id;
        article.title = tmp.title;
        article.content = tmp.content;
        article.summary = tmp.summary;
        article.isPublic = tmp.isPublic;
        article.categories = [];

        return article;
    }

    public async getPublicArticles(limit: number, page: number): Promise<ArticleEntity[]> {
        return [await this.getArticleById("two")];
    }

    public async getArticlesByCategory(limit: number, page: number, category: string): Promise<ArticleEntity[]> {
        return [];
    }

    public async countPublicArticles(): Promise<number> {
        return 1;
    }

    public async getAllArticles(limit: number, page: number): Promise<ArticleEntity[]> {
        return [await this.getArticleById("zero"), await this.getArticleById("one"), await this.getArticleById("two")];
    }

    public async countAllArticles(): Promise<number> {
        return 3;
    }

    public async checkIfArticleExists(id: string): Promise<boolean> {
        let index: number = await this.articles.findIndex(a => a.id === id);
        return (index >= 0);
    }

    public async deleteArticle(id: string): Promise<void> {
        return;
    }

    public async createArticle(title: string): Promise<ArticleEntity> {
        let article: ArticleEntity = new ArticleEntity();
        article.title = title;
        article.id = title;
        return article;
    }

    public async  adminUpdateArticle(article: ArticleEntity, user: UserEntity): Promise<ArticleEntity> {
        return article;
    }

    public async  editorUpdateArticle(article: ArticleEntity, user: UserEntity): Promise<ArticleEntity> {
        return article;
    }

}