import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../../server/models/classes/user.model';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Deserialize } from 'cerialize';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiBase: string = "/api/v0/users";

    constructor(private http: HttpClient) {
    }

    public searchUsers(name: string): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.apiBase, { params: { "name": name } }).pipe(map(res => res.map(u => Deserialize(u, UserModel))));
    }


    public getUser(id: number): Observable<UserModel> {
        return this.http.get<UserModel>(this.apiBase + "/" + id).pipe(map(res => Deserialize(res, UserModel)));
    }

    public getShortUser(id: number): Observable<UserModel> {
        return this.http.get<UserModel>(this.apiBase + "/" + id + "/short").pipe(map(res => Deserialize(res, UserModel)));
    }

    private handleError(error: HttpErrorResponse) {
        console.log("an error occurred");
    }

}