import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Deserialize, autoserialize, autoserializeAs } from 'cerialize';

@Injectable({
    providedIn: 'root'
})
export class WCAService {

    countries: string[] = ["IT"];
    constructor(private http: HttpClient) { }


    fetchUpcomingCompetitions(): Observable<CompWidgetModel[]> {
        let date: Date = new Date();
        date.setDate(date.getDate() + 1);
        let start: string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let fetchUrl: string = `https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=${this.countries[0]}&start=${start}`;
        return this.http.get(fetchUrl).pipe(map((res: any[]) => res.map(c => Deserialize(c, CompWidgetModel))));
    }

    fetchOngoingCompetitions(): Observable<CompWidgetModel[]> {
        let date: Date = new Date();
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let startDate: Date = new Date(date.getTime() - 3 * (1000 * 60 * 60 * 24));
        let endDate: Date = new Date(date.getTime() + 3 * (1000 * 60 * 60 * 24));
        let start: string = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
        let end: string = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
        let fetchUrl: string = `https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=${this.countries[0]}&start=${start}&end=${end}`;
        return this.http.get(fetchUrl)
            .pipe(map((res: any[]) => res.map(c => Deserialize(c, CompWidgetModel))
                .filter((c: CompWidgetModel) => (c.start_date.getTime() <= date.getTime() && date.getTime() <= c.end_date.getTime()))));
    }
}

const DateDeserializer = {
    Deserialize(json: any): Date {
        let date: Date = Deserialize(json, Date);
        date.setHours(0, 0, 0, 0);
        return date;
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
    @autoserializeAs(DateDeserializer)
    public start_date: Date;
    @autoserializeAs(DateDeserializer)
    public end_date: Date;
    @autoserialize
    public city: string;

}

