import { Component } from '@angular/core';
import { PanierService } from '../service/panier.service';
import { Article } from '../service/article.interface';
import { TopbarComponent } from "../topbar/topbar.component";
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ArticleService } from '../service/article.service';
import { FormsModule } from '@angular/forms';//pour les soucis de ngmodel



@Component({
  selector: 'app-panier-vue',
  imports: [TopbarComponent, NgFor, NgIf, FormsModule],
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
    private articleService: ArticleService) { }

  ngOnInit() {
    this.panierService.getPanierUser().subscribe(
      (data) => {
        if (data.error) {
          this.error = data.error;
          this.message = data.message || 'Erreur inconnue';
        }
        else if (data.panier && data.panier.articles) {
          console.log("les datas", data.panier)
          this.panier = data.panier.articles.map(article => ({
            ...article,
            stock: article.stock
          }));
        }
      }
    )
  };

  removeFromPanier(articleId: string):void {
    this.panierService.removeArticleFromCart(articleId).subscribe({
      next: (response) => {
        if (!response.error) {
          alert("Article supprimé avec succès")
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
        } 
      },
      error: (error) => {  
        console.error('Erreur lors de la mise à jour:', error);      
      }
    });
  }
  


  clearPanier() {
    this.panierService.clearPanier();
  }

  getTotal(): number {
    //reduce pour faire la somme des article.sous_total dans un tableau
    return this.panier.reduce((sum, article) => sum + article.sous_total!, 0);
  }

}
