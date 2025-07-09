import { Component, Input } from '@angular/core';
import { Article } from "../../service/article.interface"
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PanierService } from '../../service/panier.service';

@Component({
  selector: 'app-panier-preview',
  imports: [NgIf, NgFor, RouterLink, NgClass],
  templateUrl: './panier-preview.component.html',
  styleUrl: './panier-preview.component.css'
})
export class PanierPreviewComponent {
  @Input() articles: Article[] = [];

  constructor(private panierService: PanierService) { }

  // Méthode pour modifier la quantité
  modifierQuantite(article: Article, delta: number) {
    if (typeof article.quantite_utilisateur !== 'number') {
      console.error('La quantité utilisateur de l\'article est indéfinie.');
      return;
    }
    const nouvelleQuantite = article.quantite_utilisateur + delta;
    if (nouvelleQuantite < 1) return;
    article.quantite_utilisateur = nouvelleQuantite;
    this.panierService.updateQuantiteUtilisateur(article).subscribe({
      next: () => { },
      error: (err) => console.error(err)
    });
  }

  // Méthode pour supprimer l'article
  supprimerArticle(article: Article) {
    this.panierService.removeArticleFromCart(article.id).subscribe({
      next: () => {
        this.articles = this.articles.filter(a => a.id !== article.id);
      },
      error: (err) => console.error(err)
    });
  }
}
