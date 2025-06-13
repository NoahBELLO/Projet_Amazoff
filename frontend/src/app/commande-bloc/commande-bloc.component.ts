import { NgFor, NgIf } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ArticleRatingModalComponent } from '../article-rating-modal/article-rating-modal.component';
import { RouterLink } from '@angular/router';
import { CommandeRetourComponent } from "../commande-retour/commande-retour.component";

@Component({
  selector: 'app-commande-bloc',
  imports: [NgFor, NgIf, ArticleRatingModalComponent,
     RouterLink, CommandeRetourComponent,
    
  ],
  templateUrl: './commande-bloc.component.html',
  styleUrl: './commande-bloc.component.css'
})
export class CommandeBlocComponent {
  @ViewChild('ratingModal') ratingModal!: ArticleRatingModalComponent;
  @ViewChild('retourModal') retourModal!: CommandeRetourComponent;
  
  @Input() commande: any;
  @Input() isDelivered: boolean = false;
  showRetour: boolean = false;
  selectedArticleId?: string = '';


}
