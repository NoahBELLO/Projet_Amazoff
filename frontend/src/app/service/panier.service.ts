import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; //l'import pour les requêtes http
import { Article, ResponseApi } from './article.interface';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})

export class PanierService {
  //behaviorsubject permet de gèrer le panier de manière dynamique
  private panierUser = new BehaviorSubject<Article[]>([]);
  private nombreArticles = new BehaviorSubject<number>(0);

  panierUser$ = this.panierUser.asObservable();
  nombreArticles$ = this.nombreArticles.asObservable();

  private baseUrl = 'http://localhost:3001/paniers';
  private urlPaiement = "http://localhost:3001/payment_mode";
  private urlCommandes = "http://localhost:3001/commandes/en_cours";

  constructor(private http: HttpClient, private auth: AuthentificationService) { }


  // Méthode simplifiée pour récupérer le panier
  getPanierUser(): Observable<any> {
    return this.auth.checkCookie().pipe(
      map((response) => {
        return response.userId;
      }),
      switchMap((userId: string) => {
        const url = `${this.baseUrl}/${userId}`;
        return this.http.get(url).pipe(
          tap((response: any) => {
            if (response && response.rs && response.rs.articles) {
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
      })
    );
  }

  getPanierUserEtCache() {
    this.getPanierUser().subscribe({
      next: (response) => {
        if (!response.error && response.rs?.articles) {
          this.panierUser.next(response.rs.articles);
        } else {
          this.panierUser.next([]);
        }
      },
      error: () => this.panierUser.next([])
    });
  }


  //fonction de suppression d'un article du panier
  removeArticleFromCart(articleId: string): Observable<ResponseApi> {
    return this.auth.checkCookie().pipe(
      switchMap((response) => {
        const url = `${this.baseUrl}/remove_from_cart/${response.userId}`;
        return this.http.patch<ResponseApi>(
          url,
          { article_id: articleId },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }),
      catchError((error) => {
        console.error("Erreur lors de la requête Flag :", error);
        return throwError(() => error);
      })
    );
  }

  //fonction d'ajout d'un article au panier
  addArticleToCart(articleId: string, quantite: number): Observable<ResponseApi> {
    //@dur
    // const userId = '67371b2d1ed69fcb550f15e5';
    return this.auth.checkCookie().pipe(
      switchMap((response) => {
        const url = `${this.baseUrl}/add_to_cart/${response.userId}`;

        return this.http.patch<ResponseApi>(
          url,
          {
            article_id: articleId,
            quantite: quantite
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }),
      catchError((error) => {
        console.error("Erreur lors de la requête Flag :", error);
        return throwError(() => error);
      })
    );
  }

  //fonction de modification de la quantité d'un article dans un panier
  updateQuantiteUtilisateur(article: Article): Observable<ResponseApi> {
    //@dur
    // const userId = '67371b2d1ed69fcb550f15e5';
    return this.auth.checkCookie().pipe(
      switchMap((response) => {
        const url = `${this.baseUrl}/edit_cart/${response.userId}`;
        return this.http.patch<ResponseApi>(
          url,
          {
            article_id: article.id,
            quantite: article.quantite_utilisateur
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }),
      catchError((error) => {
        console.error("Erreur lors de la requête Flag :", error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour obtenir le nombre d'articles
  getNombreArticlesAuPanier(): Observable<number> {
    return this.nombreArticles$;
  }

  creerPaiement(paiement: any): Observable<any> {
    return this.http.post(`${this.urlPaiement}/create`, paiement);
  }

  creerCommande(commande: any, userId: string): Observable<any> {
    return this.http.post(`${this.urlCommandes}/create/${userId}`, commande);
  }

  viderPanier(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vider_panier/${userId}`); // adapte l'URL à ton API
  }
}
