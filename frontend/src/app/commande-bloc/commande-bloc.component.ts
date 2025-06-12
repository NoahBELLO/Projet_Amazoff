import { NgFor, NgIf } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ArticleRatingModalComponent } from '../article-rating-modal/article-rating-modal.component';

@Component({
  selector: 'app-commande-bloc',
  imports: [NgFor, NgIf, ArticleRatingModalComponent],
  templateUrl: './commande-bloc.component.html',
  styleUrl: './commande-bloc.component.css'
})
export class CommandeBlocComponent {
  @ViewChild('ratingModal') ratingModal!: ArticleRatingModalComponent;
  
  @Input() commande: any;
  @Input() isDelivered: boolean = false;
  selectedArticleId: string = '';

}
