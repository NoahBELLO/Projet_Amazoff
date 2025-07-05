import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http
import { ResponseApi } from './article.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandeEnCoursBaseUrl = 'http://localhost:6001/commandes/en_cours'
  private commandeLivreesBaseUrl = 'http://localhost:6001/commandes/livrees'
  //@dur
  protected userId = '67371b2d1ed69fcb550f15e5';
  constructor(private http: HttpClient) { }

  getCommandesEnCours(): Observable<ResponseApi> {
    const url_en_cours = `${this.commandeEnCoursBaseUrl}/${this.userId}`
    return this.http.get<ResponseApi>(url_en_cours)
  }
  getCommandesLivrees(): Observable<ResponseApi> {
    const url_livrees = `${this.commandeLivreesBaseUrl}/${this.userId}`
    return this.http.get<ResponseApi>(url_livrees)
  }



}
