import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http


@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandeEnCoursBaseUrl = 'http://localhost:6001/commandes/en_cours'
  private commandeLivreesBaseUrl = 'http://localhost:6001/commandes/livrees'

  constructor(private http: HttpClient) { }
}
