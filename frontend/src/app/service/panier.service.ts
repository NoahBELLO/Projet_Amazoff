import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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


    constructor(private http: HttpClient) {
        this.getPanierUser();
    }

    private getPanierUser() {
        this.http.get<Article[]>(this.baseUrl).subscribe(
          (panier: Article[]) => {
            this.panierUser.next(panier);
            localStorage.setItem('panier', JSON.stringify(panier));
          },
          (error) => {
            console.error('Erreur lors de la récupération du panier depuis le backend', error);
          }
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