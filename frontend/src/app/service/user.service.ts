import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/users/';

  constructor(private http: HttpClient) { }

  infoUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}info/${id}`);
  }
}
