import { Injectable } from '@angular/core';

//c'est ici qu'on fera les opérations du crud
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articles = [
    { id: "1", name: 'Teeshirt Orange', image:"teeshirt_orange.png",  prix: 20.00, stars: 2.6, stock: 5 , reduction: 10, description: "un TeeShirt orange."},
    { id: "2", name: 'Teeshirt Bleu', image:"teeshirt_bleu.png", prix: 15.50, stars: 3 , stock: 3, reduction: 10, description: "un TeeShirt Bleu."},
    { id: "3", name: 'Teeshirt Vert', image:"teeshirt_vert.png", prix: 0.50, stars: 4.4 , stock: 0, reduction: 10, description: "Une tee shirt moche."},
    { id: "4", name: 'Teeshirt Orange Nike', image:"teeshirt_orange_nike.png", prix: 1.69, stars: 0 , stock: 10, reduction: 50, description: "un teeshirt orange refait par nike."},
    { id: "5", name: 'Étendoir de Noah', image:"etendoir.png", prix: 69.69, stars: 3.5 , stock: 8, reduction: 50, description: "Pour une maxi quantité de linge."},
    { id: "6", name: "Billet d'avion pour le liban", image:"billet_avion.png", prix: 0.01, stars: 5 , stock: 1,reduction: 1, description:" Offert par la france"} ,
    { id: "7", name: "Chaussure droite pour unijambiste", image:"chaussure_droite.png", prix: 23.5, stars: 2.5 , stock: 1, reduction: 50, description: "Ça c'est une offre qui ne court pas les rues."},
    { id: "8", name: "Chaussure gauche pour unijambiste", image:"chaussure_gauche.png", prix: 23.5, stars: 2.5 , stock: 1, reduction: 50, description: "Pour que les unijambiste trouvent chaussure à leur pied."},
    { id: "9", name: "Tirelire anti-casino", image:"tirelire.png", prix: 1.99, stars: 2.5 , stock: 5, reduction: 1.99, description: "Pour les accros au casino qui ne savent pas s'arrêter." },
    { id: "10", name: "Mj débutant", image:"lorenzo.png", prix: 10, stars: 1.5 , stock: 1, reduction: 10, description: "10% de réduction car il a déjà servi."},
    { id: "11", name: "Costume", image:"costoume-jdg.gif", prix: 300, stars: 5 , stock: 1, reduction: 1, description: "Pour ceux qui ont oublié leur costume."},
  ];

  constructor() { }

  getArticles() {
    return this.articles;
  }

  getArticleByObjectId(id: string) {
    return this.articles.find(article => article.id === id);
  }

   //fonction pour préparer le score de l'article
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