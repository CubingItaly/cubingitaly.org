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

@Injectable()
export class ArticlesService {
    constructor(private httpClient: HttpClient, private authSvc: AuthService) { }

    public async createArticle(article: Article): Promise<Article> {
        article.author = this.authSvc.authUser;
        article.isPublic = false;
        return await this.httpClient.post<ArticleResponse>("/api/articles", { article: article })
            .map((response: ArticleResponse) => {
                console.log("got created article");
                console.log(response);
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                }
            }).toPromise();
    }

    public async deleteArticle(article: Article): Promise<void> {
        return await this.httpClient.delete<GenericResponse>("/api/articles/" + article.id)
            .map((response: GenericResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return;
                }
            }).toPromise();
    }

    public async updateArticle(article: Article): Promise<Article> {
        return await this.httpClient.put<ArticleResponse>("/api/articles/" + article.id, { article: article })
            .map((response: ArticleResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                }
            }).toPromise();
    }

    public async publishArticle(article: Article): Promise<Article> {
        article.isPublic = true;
        return await this.updateArticle(article);
    }

    public async hideArticle(article: Article): Promise<Article> {
        article.isPublic = false;
        return await this.updateArticle(article);
    }

    public async getArticle(id: string): Promise<Article> {
        return await this.httpClient.get<ArticleResponse>("/api/articles/" + id)
            .map((response: ArticleResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                }
            }).toPromise();
    }

    public async getArticles(): Promise<Article[]> {
        return await this.httpClient.get<ArticlesResponse>("/api/articles").map((response: ArticlesResponse) => {
            if (response.status == RESPONSE_STATUS.OK) {
                return Deserialize(response.articles, Article);
            }
        }).toPromise();
    }

    public async getCategories(): Promise<ArticleCategory[]> {
        return await this.httpClient.get<CategoriesResponse>("/api/categories").map((response: CategoriesResponse) => {
            if (response.status == RESPONSE_STATUS.OK) {
                return Deserialize(response.categories, ArticleCategory);
            }
        }).toPromise();
    }



}