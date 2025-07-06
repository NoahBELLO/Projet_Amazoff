import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http
import { ResponseApi } from './article.interface';
import { Observable, switchMap } from 'rxjs';
import { AuthentificationService } from './authentification.service';


@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandeEnCoursBaseUrl = 'http://localhost:3001/commandes/en_cours'
  private commandeLivreesBaseUrl = 'http://localhost:3001/commandes/livrees'
  //@dur
  // protected userId = '67371b2d1ed69fcb550f15e5';

  constructor(private http: HttpClient, private auth: AuthentificationService) { }

  getCommandesEnCours(): Observable<ResponseApi> {
    return this.auth.checkCookie().pipe(
      switchMap((response: any) => {
        const url_en_cours = `${this.commandeEnCoursBaseUrl}/${response.userId}`;
        return this.http.get<ResponseApi>(url_en_cours);
      })
    );
  }

  getCommandesLivrees(): Observable<ResponseApi> {
    return this.auth.checkCookie().pipe(
      switchMap((response: any) => {
        const url_livrees = `${this.commandeLivreesBaseUrl}/${response.userId}`;
        return this.http.get<ResponseApi>(url_livrees);
      })
    );
  }
}