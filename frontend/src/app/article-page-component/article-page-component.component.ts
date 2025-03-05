import { NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article-page-component',
  imports: [NgFor, NgClass],
  templateUrl: './article-page-component.component.html',
  styleUrl: './article-page-component.component.css'
})
export class ArticlePageComponentComponent {
  //le ! indique que la variable sera initialisée avant d'être utilisée
    @Input() article!: { name: string; image:string, prix: number; stars: number };

    //fonction pour préparer le score de l'article
    starsArray(etoiles_pleines: number): string[]{
      let etoiles_vides = 5 - etoiles_pleines
      const pleines = Array(etoiles_pleines).fill("fas fa-star")
      const vides =  Array(etoiles_vides).fill("far fa-star")
      //concatène les 2 tableaux
      return pleines.concat(vides)
    }
}
