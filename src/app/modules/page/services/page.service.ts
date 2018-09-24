import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageModel } from '../../../../../server/models/classes/page.model';
import { Deserialize } from 'cerialize';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private baseAPI: string = "/api/v0/pages/";

  constructor(private http: HttpClient) { }

  public getPage(id: number): Observable<PageModel> {
    return this.http.get<PageModel>(this.baseAPI + id).pipe(map(res => Deserialize(res, PageModel)));
  }

  public updatePage(page: PageModel): Observable<PageModel> {
    return this.http.put<PageModel>(this.baseAPI + page.id, { "page": page }).pipe(map(res => Deserialize(res, PageModel)));
  }
}
