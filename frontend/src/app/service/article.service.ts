import { Injectable } from '@angular/core';

//c'est ici qu'on fera les opérations du crud
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articles = [
    { id: "1", name: 'Teeshirt Orange', image:"teeshirt_orange",  prix: 20.00, stars: 2.6 },
    { id: "2", name: 'Teeshirt Bleu', image:"teeshirt_bleu", prix: 15.50, stars: 3 },
    { id: "3", name: 'Teeshirt Vert', image:"teeshirt_vert", prix: 0.50, stars: 4.4 },
    { id: "4", name: 'Teeshirt Orange Nike', image:"teeshirt_orange_nike", prix: 1.69, stars: 0 },
    { id: "5", name: 'Étendoir de Noah', image:"etendoir", prix: 69.69, stars: 3.5 },
  ];

  constructor() { }

  getArticles() {
    return this.articles;
  }

  getArticleByObjectId(id: string) {
    return this.articles.find(article => article.id === id);
  }
  
}