import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Article } from '../../../../../server/models/article.model';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ArticleCategory } from '../../../../../server/models/article.category.model';
import { CategoriesResponse } from '../../../../../server/models/responses/categories.response.model';
import { RESPONSE_STATUS } from '../../../../../server/models/enums/response.statuses';
import { map } from 'rxjs/operator/map';
import { Deserialize } from 'cerialize';
import { ArticlesResponse } from '../../../../../server/models/responses/articles.response.model';
import { ArticleResponse } from '../../../../../server/models/responses/article.response.model';
import { AuthService } from '../../../services/auth.service';
import { GenericResponse } from '../../../../../server/models/responses/generic.response.model';
import { GenericNumberResponse } from '../../../../../server/models/responses/generic.number.respose.model';

@Injectable()
export class ArticlesService {

    private article_short: string = "/api/articles";
    private article_base: string = "/api/articles/";
    private categories_base: string = "/api/categories";

    constructor(private httpClient: HttpClient, private authSvc: AuthService) { }

    public async createArticle(article: Article): Promise<Article> {
        article.author = this.authSvc.authUser;
        article.isPublic = false;
        return await this.httpClient.post<ArticleResponse>(this.article_short, { article: article })
            .map((response: ArticleResponse) => {
                console.log("got created article");
                console.log(response);
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                }
            }).toPromise();
    }

    public async deleteArticle(article: Article): Promise<void> {
        return await this.httpClient.delete<GenericResponse>(this.article_base + article.id)
            .map((response: GenericResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return;
                }
            }).toPromise();
    }

    public async updateArticle(article: Article): Promise<Article> {
        return await this.httpClient.put<ArticleResponse>(this.article_base + article.id, { article: article })
            .map((response: ArticleResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                }
            }).toPromise();
    }

    public async publishArticle(article: Article): Promise<Article> {
        article.isPublic = true;
        article.author = this.authSvc.authUser;
        return await this.updateArticle(article);
    }

    public async hideArticle(article: Article): Promise<Article> {
        article.isPublic = false;
        return await this.updateArticle(article);
    }

    public async getArticle(id: string): Promise<Article> {
        return await this.httpClient.get<ArticleResponse>(this.article_base + id)
            .map((response: ArticleResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                }
            }).toPromise();
    }

    public async getPublicArticles(page: number): Promise<Article[]> {
        page--;
        return await this.httpClient.get<ArticlesResponse>(this.article_short + "?page=" + page).map((response: ArticlesResponse) => {
            if (response.status == RESPONSE_STATUS.OK) {
                return Deserialize(response.articles, Article);
            }
        }).toPromise();
    }

    public async getPublicAllArticleNumber(): Promise<number> {
        return await this.httpClient.get<GenericNumberResponse>(this.article_base + "count/public")
            .map((response: GenericNumberResponse) => {
                console.log(response);
                if (response.status == RESPONSE_STATUS.OK) {
                    return response.value;
                }
            }).toPromise();
    }

    public async getAdminAllArticles(page: number): Promise<Article[]> {
        page--;
        return await this.httpClient.get<ArticlesResponse>(this.article_base + "admin?page=" + page)
            .map((response: ArticlesResponse) => {
                console.log(response);
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.articles, Article);
                }
            }).toPromise();
    }

    public async getAdminAllArticleNumber(): Promise<number> {
        return await this.httpClient.get<GenericNumberResponse>(this.article_base + "count/all")
            .map((response: GenericNumberResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return response.value;
                }
            }).toPromise();
    }

    public async getCategories(): Promise<ArticleCategory[]> {
        return await this.httpClient.get<CategoriesResponse>(this.categories_base).map((response: CategoriesResponse) => {
            if (response.status == RESPONSE_STATUS.OK) {
                return Deserialize(response.categories, ArticleCategory);
            }
        }).toPromise();
    }

}