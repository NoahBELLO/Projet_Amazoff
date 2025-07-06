import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http
import { Observable } from 'rxjs';
import { Article, RatingData, ResponseApi } from './article.interface';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articleBaseUrl = 'http://localhost:3001/articles';
  private avisBaseUrl = 'http://localhost:3001/avis';

  constructor(private http: HttpClient, private auth: AuthentificationService) { }

  //observable gère les réponses asychrones
  createArticle(articleData: FormData): Observable<ResponseApi> {
    const url = `${this.articleBaseUrl}/create`;
    //post suivi de l'objet article
    return this.http.post<ResponseApi>(url, articleData);
  }

  // getArticles(): Observable<ResponseApi> {
  //   const url = `${this.articleBaseUrl}/`;
  //   return this.http.get<ResponseApi>(url);
  // }

  getArticleByObjectId(id: string): Observable<ResponseApi> {
    console.log(id)
    const url = `${this.articleBaseUrl}/${id}`;
    return this.http.get<ResponseApi>(url);

  }

  starsArray(etoiles: number): string[] {
    const etoiles_pleines: number = Math.floor(etoiles); //arrondi à l'entier inférieur
    const demi_etoile: boolean = (etoiles % 1) >= 0.5; //vérifie si supérieur à .5
    const etoiles_vides: number = 5 - etoiles_pleines - (demi_etoile ? 1 : 0); //vérifie si demi étoile

    let rating: string[] = [];
    for (let i = 0; i < etoiles_pleines; i++) {
      rating.push("fas fa-star");
    }
    if (demi_etoile) {
      rating.push("fas fa-star-half-alt");
    }
    for (let i = 0; i < etoiles_vides; i++) {
      rating.push("far fa-star");
    }

    return rating;
  }

  getStock(stock: number): number[] {
    let quantitees: number[] = []
    for (let i = 0; i < stock; i++)
      quantitees.push(i + 1);
    return quantitees;
  }

  ratingArticle(ratingData: RatingData): Observable<ResponseApi> {
    return new Observable<ResponseApi>((observer) => {
      this.auth.checkCookie().subscribe({
        next: (response) => {
          const url = `${this.avisBaseUrl}/rating_article`;
          ratingData.user_id = response.userId;

          this.http.post<ResponseApi>(
            url,
            {
              article_id: ratingData.articleId,
              comment: ratingData.comment,
              stars: ratingData.stars,
              user_id: ratingData.user_id
            },
            { headers: { 'Content-Type': 'application/json' } }
          ).subscribe({
            next: (res) => {
              observer.next(res);
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            }
          });
        },
        error: (error) => {
          console.error("Erreur lors de la requête Flag :", error);
          observer.error(error);
        }
      });
    });
  }

  search(searchKeys: string): Observable<ResponseApi> {
    const url = `${this.articleBaseUrl}/search`;
    return this.http.post<ResponseApi>(
      url,
      {
        q: searchKeys
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

}