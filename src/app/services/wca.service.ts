import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, share } from 'rxjs/operators';
import { Deserialize, autoserialize, autoserializeAs } from 'cerialize';

@Injectable({
    providedIn: 'root'
})
export class WCAService {

    countries: string[] = ["IT"];
    constructor(private http: HttpClient) { }

    upcomingCache: CompWidgetModel[];
    upcomingObservable: Observable<CompWidgetModel[]>;
    upcomingCacheTime: number;

    fetchUpcomingCompetitions(): Observable<CompWidgetModel[]> {
        let now = new Date();
        if (this.upcomingCacheTime && ((now.getTime() - this.upcomingCacheTime) < 300000)) {
            return of(this.upcomingCache);
        } else if (this.upcomingObservable) {
            return this.upcomingObservable;
        } else {
            let date = new Date();
            date.setDate(date.getDate() + 1);
            let start: string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            let fetchUrl: string = `https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=${this.countries[0]}&start=${start}`;
            this.upcomingObservable = this.http.get(fetchUrl)
                .pipe(share(), map((res: any[]) => {
                    res.map(c => Deserialize(c, CompWidgetModel));
                    this.upcomingObservable = null;
                    this.upcomingCache = res;
                    return this.upcomingCache;
                }));
            this.upcomingCacheTime = (new Date()).getTime();
            return this.upcomingObservable;
        }
    }


    ongoingCache: CompWidgetModel[];
    ongoingObservable: Observable<CompWidgetModel[]>;
    ongoingCacheTime: number;


    fetchOngoingCompetitions(): Observable<CompWidgetModel[]> {
        let now = new Date();
        if (this.ongoingCacheTime && ((now.getTime() - this.ongoingCacheTime) < 300000)) {
            return of(this.ongoingCache);
        } else if (this.ongoingObservable) {
            return this.ongoingObservable;
        } else {
            let date: Date = new Date();
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            let startDate: Date = new Date(date.getTime() - 3 * (1000 * 60 * 60 * 24));
            let endDate: Date = new Date(date.getTime() + 3 * (1000 * 60 * 60 * 24));
            let start: string = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
            let end: string = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
            let fetchUrl: string = `https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=${this.countries[0]}&start=${start}&end=${end}`;

            this.ongoingObservable = this.http.get(fetchUrl)
                .pipe(share(), map((res: any[]) => {
                    res = res.map(c => Deserialize(c, CompWidgetModel));
                    res = res.filter((c: CompWidgetModel) => (c.start_date.getTime() <= date.getTime() && date.getTime() <= c.end_date.getTime()));
                    this.ongoingObservable = null;
                    this.ongoingCache = res;
                    return this.ongoingCache;
                }));
            this.ongoingCacheTime = (new Date()).getTime();
            return this.ongoingObservable;
        }
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

