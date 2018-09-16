import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleModel } from '../../../../../server/models/classes/article.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';
import { ArticleCategoryModel } from '../../../../../server/models/classes/category.model';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiBase: string = "/api/v0/articles";

  constructor(private http: HttpClient) { }

  public getPublicArticles(limit: number, page: number, category: string): Observable<ArticleModel[]> {
    return this.http.get<ArticleModel[]>(this.apiBase + "?limit=" + limit + "&page=" + page + (category ? "&category=" + category : "")).pipe(map(res => Deserialize(res, ArticleModel)));
  }

  public getArticle(id: string): Observable<ArticleModel> {
    return this.http.get<ArticleModel>(this.apiBase + "/" + id).pipe(map(res => Deserialize(res, ArticleModel)));
  }

  public countPublicArticles(): Observable<any> {
    return this.http.get<any>(this.apiBase + "/count/public");
  }

  public getAllArticles(limit: number, page: number): Observable<ArticleModel[]> {
    return this.http.get<ArticleModel[]>(this.apiBase + "/admin?limit=" + limit + "&page=" + page).pipe(map(res => Deserialize(res, ArticleModel)));
  }

  public countAllArticles(): Observable<any> {
    return this.http.get<any>(this.apiBase + "/count/all");
  }

  public createArticle(article: ArticleModel): Observable<ArticleModel> {
    return this.http.post<ArticleModel>(this.apiBase, { "article": article }).pipe(map(result => Deserialize(result, ArticleModel)));
  }

  public updateArticle(article: ArticleModel): Observable<ArticleModel> {
    return this.http.put<ArticleModel>(this.apiBase + "/" + article.id, { "article": article }).pipe(map(result => Deserialize(result, ArticleModel)));
  }

  public publishArticle(article: ArticleModel): Observable<ArticleModel> {
    article.isPublic = true;
    return this.http.put<ArticleModel>(this.apiBase + "/" + article.id + "/admin", { "article": article }).pipe(map(result => Deserialize(result, ArticleModel)));
  }

  public unpublishArticle(article: ArticleModel): Observable<ArticleModel> {
    article.isPublic = false;
    return this.http.put<ArticleModel>(this.apiBase + "/" + article.id + "/admin", { "article": article }).pipe(map(result => Deserialize(result, ArticleModel)));
  }

  public deleteArticle(article: ArticleModel): Observable<void> {
    return this.http.delete<void>(this.apiBase + "/" + article.id + "/admin");
  }




  public getCategories(): Observable<ArticleCategoryModel[]> {
    return this.http.get<ArticleCategoryModel[]>("/api/v0/categories").pipe(map(result => result.map(c => Deserialize(c, ArticleCategoryModel))));
  }



}
