import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http
import { Observable } from 'rxjs';
import { Article, RatingData, ResponseApi } from './article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articleBaseUrl = 'http://localhost:6001/articles';
  private avisBaseUrl = 'http://localhost:6001/avis';

  constructor(private http: HttpClient) { }

  //observable gère les réponses asychrones
  createArticle(articleData: FormData): Observable<ResponseApi> {
    const url = `${this.articleBaseUrl}/create`;
    //post suivi de l'objet article
    return this.http.post<ResponseApi>(url, articleData);
  }

  getArticles(): Observable<ResponseApi> {
    const url = `${this.articleBaseUrl}/`;
    return this.http.get<ResponseApi>(url);
  }

  getArticleByObjectId(id: string): Observable<ResponseApi> {
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

  ratingArticle(ratingData: RatingData): Observable<ResponseApi>{
    const userId = '67371b2d1ed69fcb550f15e5';
    const url = `${this.avisBaseUrl}/rating_article`;
    ratingData.comments.user_id = userId;

    return this.http.patch<ResponseApi>(
      url,
      {
        article_id: ratingData.articleId,
        comments: ratingData.comments,
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

}