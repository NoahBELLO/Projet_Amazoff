import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; //l'import pour les requêtes http
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
    return this.http.get<{ error: boolean, message?: string, articles?: Article[] }>(url).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du panier depuis le backend', error);
        return throwError(() => ({ error: true, message: 'Erreur lors de la récupération du panier' }));
      })
    );
  }
  
  //fonction de suppression d'un article du panier
  removeArticleFromCart(articleId: string): Observable<{ error: boolean, message?: string }> {
    const userId = '67371b2d1ed69fcb550f15e4';
    const url = `${this.baseUrl}/remove_from_cart/${userId}`;
    
    return this.http.patch<{ error: boolean, message?: string }>(
      url,
      { article_id: articleId },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  //fonction d'ajout d'un article au panier
  addArticleToCart(articleId: string, quantite: number): Observable<{ error: boolean, message?: string }> {
    const userId = '67371b2d1ed69fcb550f15e4';
    const url = `${this.baseUrl}/add_to_cart/${userId}`;

    return this.http.patch<{ error: boolean, message?: string }>(
      url,
      { 
        article_id: articleId,
        quantite: quantite
       },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  
  updateQuantiteUtilisateur(article: Article): Observable<{ error: boolean, message?: string }>{
    const userId = '67371b2d1ed69fcb550f15e4';
    const url = `${this.baseUrl}/edit_cart/${userId}`;

    return this.http.patch<{ error: boolean, message?: string }>(
      url,
      { 
        article_id: article.id,
        quantite: article.quantite_utilisateur
       },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  

  clearPanier() {
    this.panierUser.next([]);
    localStorage.removeItem('panier');
  }
}