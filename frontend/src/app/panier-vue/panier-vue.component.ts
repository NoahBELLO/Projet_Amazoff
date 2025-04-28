import { Component } from '@angular/core';
import { PanierService } from '../service/panier.service';
import { Article } from '../service/article.interface';

@Component({
  selector: 'app-panier-vue',
  imports: [],
  templateUrl: './panier-vue.component.html',
  styleUrl: './panier-vue.component.css'
})
export class PanierVueComponent {
  panier: Article[] = []; //liste d'article = au panier

  constructor(private panierService: PanierService) {}

  ngOnInit() {
    this.panierService.panier$.subscribe(panier => {
      this.panier = panier;
    });
  }

  removeFromPanier(articleId: string) {
    this.panierService.removeFromPanier(articleId);
  }

  clearPanier() {
    this.panierService.clearPanier();
  }
}
