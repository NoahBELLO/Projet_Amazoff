import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; //l'import pour les requêtes http
import { Article, ResponseApi } from './article.interface';

@Injectable({
  providedIn: 'root'
})

export class PanierService {
  //behaviorsubject permet de gèrer le panier de manière dynamique
  private panierUser = new BehaviorSubject<Article[]>([]);
  private nombreArticles = new BehaviorSubject<number>(0);

  panierUser$ = this.panierUser.asObservable();
  nombreArticles$ = this.nombreArticles.asObservable();

  private baseUrl = 'http://localhost:6001/panier';


  constructor(private http: HttpClient) { }


  // Méthode simplifiée pour récupérer le panier
  getPanierUser(): Observable<any> {
    const userId = '67371b2d1ed69fcb550f15e5';
    const url = `${this.baseUrl}/${userId}`;


    return this.http.get(url).pipe(
      tap((response: any) => {

        if (response && response.rs && response.rs && response.rs.articles) {
          this.panierUser.next(response.rs.articles);
          const count = response.rs.articles.length; //compteur articles
          this.nombreArticles.next(count);


        } else {
          console.log("Aucun article trouvé dans la réponse");
          this.panierUser.next([]);
          this.nombreArticles.next(0);
        }
      }),
      catchError(error => {
        console.error('Erreur:', error);
        this.panierUser.next([]);
        this.nombreArticles.next(0);
        return throwError(() => error);
      })
    );
  }




  //fonction de suppression d'un article du panier
  removeArticleFromCart(articleId: string): Observable<ResponseApi> {
    const userId = '67371b2d1ed69fcb550f15e5';
    const url = `${this.baseUrl}/remove_from_cart/${userId}`;

    return this.http.patch<ResponseApi>(
      url,
      { article_id: articleId },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  //fonction d'ajout d'un article au panier
  addArticleToCart(articleId: string, quantite: number): Observable<ResponseApi> {
    const userId = '67371b2d1ed69fcb550f15e5';
    const url = `${this.baseUrl}/add_to_cart/${userId}`;

    return this.http.patch<ResponseApi>(
      url,
      {
        article_id: articleId,
        quantite: quantite
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  //fonction de modification de la quantité d'un article dans un panier
  updateQuantiteUtilisateur(article: Article): Observable<ResponseApi> {
    const userId = '67371b2d1ed69fcb550f15e5';
    const url = `${this.baseUrl}/edit_cart/${userId}`;

    return this.http.patch<ResponseApi>(
      url,
      {
        article_id: article.id,
        quantite: article.quantite_utilisateur
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Méthode pour obtenir le nombre d'articles
  getNombreArticlesAuPanier(): Observable<number> {
    return this.nombreArticles$;
  }

}
