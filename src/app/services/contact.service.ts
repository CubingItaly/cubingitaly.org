import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  public sendMail(sender: string, email: string, subject: string, message: string): Observable<any> {
    return this.http.post("/api/v0/contact", { "sender": sender, "email": email, "subject": subject, "message": message });
  }
}
