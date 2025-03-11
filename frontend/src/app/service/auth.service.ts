import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // URL de votre backend

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { login, password });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retourne true si un token est présent
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
