import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Article } from '../../../../../server/models/article.model';
import { CIUser } from '../../../../../server/models/ci.user.model';
import { ArticleCategory } from '../../../../../server/models/article.category.model';
import { CategoriesResponse } from '../../../../../server/models/responses/categories.response.model';
import { RESPONSE_STATUS } from '../../../../../server/models/enums/response.statuses';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';
import { ArticlesResponse } from '../../../../../server/models/responses/articles.response.model';
import { ArticleResponse } from '../../../../../server/models/responses/article.response.model';
import { AuthService } from '../../../services/auth.service';
import { GenericResponse } from '../../../../../server/models/responses/generic.response.model';
import { GenericNumberResponse } from '../../../../../server/models/responses/generic.number.respose.model';
import { CommonEndpointService } from '../../commons/services/common.endpoint.service';
import { IOnHttpErrorEventArgs } from '../../commons/interfaces/IOnHttpErrorEventArgs';

@Injectable()
export class ArticlesService extends CommonEndpointService {

    private article_short: string = "/api/articles";
    private article_base: string = "/api/articles/";
    private categories_base: string = "/api/categories";

    constructor(private httpClient: HttpClient, private authSvc: AuthService) {
        super(httpClient);
    }

    /**
     * Creates an article, which is automatically set to private
     * 
     * @param {Article} article 
     * @returns {Promise<Article>} 
     * @memberof ArticlesService
     */
    public async createArticle(article: Article): Promise<Article> {
        article.author = this.authSvc.authUser;
        article.isPublic = false;
        return await this.POST<ArticleResponse, Article, any>(this.article_short, {
            article: article
        });
        /*
        return await this.httpClient.post<ArticleResponse>(this.article_short, { article: article })
            .map((response: ArticleResponse) => {
                if (response.status == RESPONSE_STATUS.OK) {
                    return Deserialize(response.article, Article);
                } else {
                    //show error
                }
            }).toPromise();
        */
    }

    /**
     * Delete an article
     * 
     * @param {Article} article 
     * @returns {Promise<void>} 
     * @memberof ArticlesService
     */
    public async deleteArticle(article: Article): Promise<void> {
        return await this.httpClient.delete<GenericResponse>(this.article_base + article.id)
            .pipe(
                map(
                    (response: GenericResponse) => {
                        if (response.status === RESPONSE_STATUS.OK) {
                            return;
                        } else {
                            //show error
                        }
                    }
                )
            ).toPromise();
    }

    /**
     * Update an article
     * 
     * @param {Article} article 
     * @returns {Promise<Article>} 
     * @memberof ArticlesService
     */
    public async updateArticle(article: Article): Promise<Article> {
        return await this.httpClient.put<ArticleResponse>(this.article_base + article.id, { article: article })
            .pipe(
                map(
                    (response: ArticleResponse) => {
                    if (response.status == RESPONSE_STATUS.OK) {
                        return Deserialize(response.article, Article);
                    } else {
                        //show error
                    }
                })
            ).toPromise();
    }

    /**
     * Publish an article
     * 
     * @param {Article} article 
     * @returns {Promise<Article>} 
     * @memberof ArticlesService
     */
    public async publishArticle(article: Article): Promise<Article> {
        article.isPublic = true;
        article.author = this.authSvc.authUser;
        return await this.updateArticle(article);
    }

    /**
     * Unpublish an already published article
     * 
     * @param {Article} article 
     * @returns {Promise<Article>} 
     * @memberof ArticlesService
     */
    public async hideArticle(article: Article): Promise<Article> {
        article.isPublic = false;
        return await this.updateArticle(article);
    }

    /**
     * Get an article by id
     * 
     * @param {string} id 
     * @returns {Promise<Article>} 
     * @memberof ArticlesService
     */
    public async getArticle(id: string): Promise<Article> {
        return await this.httpClient.get<ArticleResponse>(this.article_base + id)
            .pipe(
                map(
                    (response: ArticleResponse) => {
                        if (response.status == RESPONSE_STATUS.OK) {
                            return Deserialize(response.article, Article);
                        } else {
                            //show error
                        }
                    })
                ).toPromise();
    }

    /**
     * Get all the articles public articles of a given page
     * 
     * @param {number} page 
     * @returns {Promise<Article[]>} 
     * @memberof ArticlesService
     */
    public async getPublicArticles(page: number): Promise<Article[]> {
        page--;
        return await this.GET<ArticlesResponse, Article[], any>(this.article_short + "?page=" + page);
        /*
        return await this.httpClient.get<ArticlesResponse>(this.article_short + "?page=" + page).map((response: ArticlesResponse) => {
            if (response.status == RESPONSE_STATUS.OK) {
                return Deserialize(response.articles, Article);
            } else {
                //show error
            }
        }).toPromise();
        */
    }

    /**
     * Gets the number of all the public articles
     * 
     * @returns {Promise<number>} 
     * @memberof ArticlesService
     */
    public async getPublicAllArticleNumber(): Promise<number> {
        return await this.httpClient.get<GenericNumberResponse>(this.article_base + "count/public")
            .pipe(
                map(
                    (response: GenericNumberResponse) => {
                        console.log(response);
                        if (response.status == RESPONSE_STATUS.OK) {
                            return response.value;
                        } else {
                            //show error
                        }
                    })
                ).toPromise();
    }

    /**
     * Get all the articles, public and not, of a given page
     * 
     * @param {number} page 
     * @returns {Promise<Article[]>} 
     * @memberof ArticlesService
     */
    public async getAdminAllArticles(page: number): Promise<Article[]> {
        page--;
        return await this.httpClient.get<ArticlesResponse>(this.article_base + "admin?page=" + page)
            .pipe(
                map(
                    (response: ArticlesResponse) => {
                        console.log(response);
                        if (response.status == RESPONSE_STATUS.OK) {
                            return Deserialize(response.articles, Article);
                        } else {
                            //show error
                        }
                    })
                ).toPromise();
    }

    /**
     * Gets the number of all the articles, public and not
     * 
     * @returns {Promise<number>} 
     * @memberof ArticlesService
     */
    public async getAdminAllArticleNumber(): Promise<number> {
        return await this.httpClient.get<GenericNumberResponse>(this.article_base + "count/all")
            .pipe(
                map(
                    (response: GenericNumberResponse) => {
                        if (response.status == RESPONSE_STATUS.OK) {
                            return response.value;
                        } else {
                            //show error
                        }
                    })
                ).toPromise();
    }

    /**
     * Get the list of categories
     * 
     * @returns {Promise<ArticleCategory[]>} 
     * @memberof ArticlesService
     */
    public async getCategories(): Promise<ArticleCategory[]> {
        return await this.httpClient.get<CategoriesResponse>(this.categories_base)
            .pipe(
                map((response: CategoriesResponse) => {
                    if (response.status == RESPONSE_STATUS.OK) {
                        return Deserialize(response.categories, ArticleCategory);
                    }
                })
            ).toPromise();
    }

}