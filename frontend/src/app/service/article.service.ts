import { Injectable } from '@angular/core';

//c'est ici qu'on fera les opérations du crud
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articles = [
    { name: 'Teeshirt Orange', image:"teeshirt_orange",  prix: 20.00, stars: 4 },
    { name: 'Teeshirt Bleu', image:"teeshirt_bleu", prix: 15.50, stars: 3 },
    { name: 'Teeshirt Vert', image:"teeshirt_vert", prix: 0.50, stars: 5 },
    { name: 'Teeshirt Orange Nike', image:"teeshirt_orange_nike", prix: 1.69, stars: 0 },
  ];


  constructor() { }

  getArticles() {
    return this.articles;
  }
  
}