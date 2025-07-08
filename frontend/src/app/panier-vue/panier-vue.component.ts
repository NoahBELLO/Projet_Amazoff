import { Component } from '@angular/core';
import { PanierService } from '../service/panier.service';
import { Article } from '../service/article.interface';
import { TopbarComponent } from "../topbar/topbar.component";
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ArticleService } from '../service/article.service';
import { FormsModule } from '@angular/forms';//pour les soucis de ngmodel
import { Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';


@Component({
  selector: 'app-panier-vue',
  imports: [TopbarComponent, NgFor, NgIf, FormsModule, RouterLink, AsyncPipe],
  templateUrl: './panier-vue.component.html',
  styleUrl: './panier-vue.component.css'
})
export class PanierVueComponent {
  panier: Article[] = []; //liste d'article = au panier
  error: boolean = false;
  message: string = '';
  quantitee: number[] = []

  constructor(
    private panierService: PanierService,
    private articleService: ArticleService,
    private router: Router, public authService: AuthentificationService
  ) { }

  ngOnInit() {
    this.panierService.getPanierUser().subscribe(
      (response) => {
        if (!response.error) {
          this.panier = response.rs.articles.map((article: { stock: any; }) => ({
            ...article,
            stock: article.stock
          }));
        } else {
          this.error = response.error;
          this.message = response.message || 'Erreur inconnue';
        }
      },
      (err) => {
        this.error = true;
        this.message = 'Erreur lors de la récupération du panier';
        console.error(err);
      }
    );
  }


  removeFromPanier(articleId: string): void {
    this.panierService.removeArticleFromCart(articleId).subscribe({
      next: (response) => {
        if (!response.error) {
          console.log("succès")
          window.location.reload(); //rafraichis la page
        }
      },
      error: (error) => {
        alert(error)
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }

  getQuantityOptions(article: Article): number[] {
    const stock: number[] = [];
    for (let i = 1; i <= article.stock; i++) {
      stock.push(i);
    }
    return stock;
  }


  modifyQuantite(article: Article) {
    this.panierService.updateQuantiteUtilisateur(article).subscribe({
      next: (response) => {
        if (!response.error) {
          article.sous_total = article.prix * article.quantite_utilisateur!;
          window.location.reload();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }

  getTotal(): number {
    //reduce pour faire la somme des article.sous_total dans un tableau
    return this.panier.reduce((sum, article) => sum + article.sous_total!, 0);
  }

}
