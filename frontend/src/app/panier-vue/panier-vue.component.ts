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
            quantite: article.quantite
          }));
        }
      }
    )
  };

  getStockOptions(stock: number): number[] {
    return this.articleService.getStock(stock);
  }

  removeFromPanier(articleId: string) {
    this.panierService.removeArticleFromCart(articleId).subscribe({
      next: (res) => console.log(res),
      error: (error) => console.error('Erreur lors du retrait', error)
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
