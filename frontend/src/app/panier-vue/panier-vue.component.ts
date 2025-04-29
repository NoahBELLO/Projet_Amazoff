import { Component } from '@angular/core';
import { PanierService } from '../service/panier.service';
import { Article } from '../service/article.interface';
import { TopbarComponent} from "../topbar/topbar.component";
import { NgClass, NgFor, NgIf } from '@angular/common';



@Component({
  selector: 'app-panier-vue',
  imports: [TopbarComponent, NgFor, NgClass, NgIf],
  templateUrl: './panier-vue.component.html',
  styleUrl: './panier-vue.component.css'
})
export class PanierVueComponent {
  panier: Article[] = []; //liste d'article = au panier

  constructor(private panierService: PanierService) {}

  ngOnInit() {
    this.panierService.getPanierUser().subscribe(
      (data) => {
        (data.error)
        console.log("les datas", data)
        this.panier = data
      },
    )
    };
  

  removeFromPanier(articleId: string) {
    this.panierService.removeFromPanier(articleId);
  }

  clearPanier() {
    this.panierService.clearPanier();
  }
}
