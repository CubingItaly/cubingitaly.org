import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TutorialModel } from '../../../../../server/models/classes/tutorial.model';
import { Deserialize } from 'cerialize';
import { map } from 'rxjs/operators';
import { PageModel } from '../../../../../server/models/classes/page.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private baseAPI: string = "/api/v0/tutorial";

  constructor(private http: HttpClient) { }

  public getTutorials(): Observable<TutorialModel[]> {
    return this.http.get<TutorialModel[]>(this.baseAPI).pipe(map(res => res.map(p => Deserialize(p, TutorialModel))));
  }

  public getAllTutorials(): Observable<TutorialModel[]> {
    return this.http.get<TutorialModel[]>(this.baseAPI + "/admin").pipe(map(res => res.map(p => Deserialize(p, TutorialModel))));
  }

  public getTutorial(id: string): Observable<TutorialModel> {
    return this.http.get<TutorialModel>(this.baseAPI + "/" + id).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public createTutorial(title: string): Observable<TutorialModel> {
    return this.http.post<TutorialModel>(this.baseAPI, { "title": title }).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public deleteTutorial(id: string): Observable<void> {
    return this.http.delete<void>(this.baseAPI + "/" + id);
  }

  public publishTutorial(tutorial: TutorialModel): Observable<TutorialModel> {
    tutorial.isPublic = true;
    return this.http.put<TutorialModel>(this.baseAPI + "/" + tutorial.id + "/admin", { "tutorial": tutorial }).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public unpublishTutorial(tutorial: TutorialModel): Observable<TutorialModel> {
    tutorial.isPublic = false;
    return this.http.put<TutorialModel>(this.baseAPI + "/" + tutorial.id + "/admin", { "tutorial": tutorial }).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public updateTutorial(tutorial: TutorialModel): Observable<TutorialModel> {
    return this.http.put<TutorialModel>(this.baseAPI + "/" + tutorial.id, { "tutorial": tutorial }).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public addPage(tutorial: TutorialModel, page: PageModel): Observable<TutorialModel> {
    return this.http.post<TutorialModel>(this.baseAPI + "/" + tutorial.id + "/pages", { "page": page }).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public removePage(tutorial: TutorialModel, page: PageModel): Observable<TutorialModel> {
    return this.http.delete<TutorialModel>(this.baseAPI + "/" + tutorial.id + "/pages/" + page.id).pipe(map(res => Deserialize(res, TutorialModel)));
  }

  public movePage(tutorial: TutorialModel, pageId: number, delta: number): Observable<TutorialModel> {
    return this.http.put<TutorialModel>(this.baseAPI + "/" + tutorial.id + "/pages/" + pageId, { "delta": delta }).pipe(map(res => Deserialize(res, TutorialModel)));
  }
}
