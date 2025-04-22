import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //l'import pour les requêtes http
import { Observable } from 'rxjs';
import { Article } from './article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articles: any[] = [];

  private baseUrl = 'http://localhost:6001/articles';

  constructor(private http: HttpClient) {}
  
  //observable gère les réponses asychrones
  createArticle(articleData: FormData): Observable<any>{
    const url = `${this.baseUrl}/create`;
    //post suivi de l'objet article
    return this.http.post<Article>(url, articleData);
  }

  getArticles(): Observable<Article[]> {
    const url = `${this.baseUrl}/`;
    return this.http.get<Article[]>(url);
  }

  getArticleByObjectId(id: string): Observable<Article>{
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Article>(url);

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

  getStock(stock: number): number[]{
    let quantitees: number[] = []
    for(let i =0; i < stock; i++)
      quantitees.push(i+1);
    return quantitees ;
  }
  
}