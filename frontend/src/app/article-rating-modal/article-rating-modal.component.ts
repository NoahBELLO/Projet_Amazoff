import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ArticleService } from '../service/article.service';
import { RatingData } from '../service/article.interface';

@Component({
  selector: 'app-article-rating-modal',
  templateUrl: './article-rating-modal.component.html',
  styleUrls: ['./article-rating-modal.component.css'],
  imports: [FormsModule, NgFor, NgIf]
})
export class ArticleRatingModalComponent {
  @Input() articleId: string = '';
  isModalOpen: boolean = false;
  selectedRating: number = 0;
  comment: string = '';

  constructor(
    private articleService: ArticleService) { }

  openModal(articleId: string): void {
    this.isModalOpen = true;
    this.selectedRating = 0;
    this.comment = '';
    this.articleId = articleId
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitRating(): void {
    if (this.selectedRating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    const ratingData: RatingData = {
      articleId: this.articleId,
      comment: this.comment,
      stars: this.selectedRating,      
    };
    console.log(this.articleId)
    console.log('Évaluation soumise:', ratingData);
    this.articleService.ratingArticle(ratingData).subscribe({
      next: (response) => {
        if (!response.error) {
          alert("Article évalué avec succès") //@notification
          this.closeModal();
        }
      },
      error: (error) => {
        alert("Erreur lors de l'évaluation")
        console.error("Erreur lors de l'évaluation", error)
      }
    });
  }
}
