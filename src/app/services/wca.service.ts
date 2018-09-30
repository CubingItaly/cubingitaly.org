import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Deserialize, autoserialize } from 'cerialize';

@Injectable({
  providedIn: 'root'
})
export class WCAService {

  countries: string[] = ["IT"]
  fetchUrl: string = "https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IT&start=";
  constructor(private http: HttpClient) { }

  fetchComp(): Observable<CompWidgetModel[]> {
    let date: Date = new Date();
    let strDate: string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return this.http.get(this.fetchUrl + strDate).pipe(map((res: any[]) => res.map(c => Deserialize(c, CompWidgetModel)).sort((a, b) => {
      if (a.start_date < b.start_date)
        return -1;
      if (a.start_date > b.start_date)
        return 1;
      return 0;
    })));
  }
}

export class CompWidgetModel {

  @autoserialize
  public id: string;
  @autoserialize
  public name: string;
  @autoserialize
  public website: string;
  @autoserialize
  public short_name: string;
  @autoserialize
  public start_date: Date;
  @autoserialize
  public end_date: Date;
  @autoserialize
  public city: string;
}
