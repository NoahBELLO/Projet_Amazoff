import { NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-page-component',
  imports: [NgFor, NgClass, RouterLink],
  templateUrl: './article-page-component.component.html',
  styleUrl: './article-page-component.component.css'
})
export class ArticlePageComponentComponent {
  //le ! indique que la variable sera initialisée avant d'être utilisée
    @Input() article!: { id: string, name: string; image:string, prix: number; stars: number };

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
}
