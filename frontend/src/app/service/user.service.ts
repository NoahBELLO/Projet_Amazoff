import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/users/';
  private apiRolesUrl = 'http://localhost:3001/roles/';

  constructor(private http: HttpClient) { }

  infoUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}info/${id}`);
  }

  infosUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}infos/${id}`);
  }

  updateUser(id: string, data: any) {
    console.log('Updating user:', id);
    console.log(data);
    const userPatch: { [key: string]: any } = {};
    if (data.name) userPatch['name'] = data.name;
    if (data.fname) userPatch['fname'] = data.fname;
    if (data.adress) userPatch['adress'] = data.adress;
    if (data.email) userPatch['email'] = data.email;
    if (data.login) userPatch['login'] = data.login;
    // On ne traite le mot de passe que s'il est renseigné
    if (data.password) {
      return from(this.hashSHA256(data.password)).pipe(
        switchMap(hash => {
          userPatch['password'] = hash;
          return this.http.patch(`${this.apiUrl}${id}`, userPatch);
        })
      );
    }

    // Sinon, on envoie directement le patch sans password
    return this.http.patch(`${this.apiUrl}${id}`, userPatch);
  }

  deleteUser(id: string): Observable<any> {
    console.log('Deleting user:', id);
    return this.http.delete(`${this.apiUrl}id/${id}`);
  }

  async hashSHA256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  updateUserRole(userId: string, newRole: string) {
    return this.http.patch(`${this.apiUrl}role/${userId}`, { role: newRole });
  }

  getAllRoles(): Observable<any> {
    return this.http.get<any[]>(`${this.apiRolesUrl}`); 
  }
}
