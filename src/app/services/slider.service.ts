import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private cache;
  private observable: Observable<string[]>;
  private cacheTime: number;


  /**
   * Creates an instance of AuthService.
   * Retrieves user info and if the user is logged in, initializes the public attributes
   * 
   * @param {HttpClient} http 
   * @memberof AuthService
   */
  constructor(private http: HttpClient) {
  }

  public images(size: string): Observable<any> {
    let now = new Date();
    if (this.cache && ((now.getTime() - this.cacheTime) < 300000)) {
      return of(this.cache[size]);
    } else if (this.observable) {
      return this.observable;
    } else {
      this.observable = this.http.get('/assets/images/banner/image-array.json')
        .pipe(share(), map(r => {
          this.observable = null;
          this.cache = r;
          return this.cache[size];
        }));
      this.cacheTime = (new Date()).getTime();
      return this.observable;
    }
  }
}
