import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http
import { Article } from './article.interface';

@Injectable({
  providedIn: 'root'
})

export class PanierService {
  //behaviorsubject permet de gèrer le panier de manière dynamique
  private panierUser = new BehaviorSubject<Article[]>([]);
  panier$ = this.panierUser.asObservable();

  private baseUrl = 'http://localhost:6001/panier';


  constructor(private http: HttpClient) {}


  getPanierUser():Observable<{error: boolean, message?: string, panier?:{ articles: Article[] }}> {
    const userId = '67371b2d1ed69fcb550f15e4'; 
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get<{ error: boolean, message: string, articles?: Article[] }>(url).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du panier depuis le backend', error);
        return throwError(() => ({ error: true, message: 'Erreur lors de la récupération du panier' }));
      })
    );
  }
  
  
  addToPanier(article: Article) {
    const currentPanier = this.panierUser.value;
    const updatedPanier = [...currentPanier, article];
    this.panierUser.next(updatedPanier);
    localStorage.setItem('panier', JSON.stringify(updatedPanier));
  }

  removeFromPanier(articleId: string) {
    const currentPanier = this.panierUser.value;
    const updatedPanier = currentPanier.filter(article => article.id !== articleId);
    this.panierUser.next(updatedPanier);
    localStorage.setItem('panier', JSON.stringify(updatedPanier));
  }

  clearPanier() {
    this.panierUser.next([]);
    localStorage.removeItem('panier');
  }
}