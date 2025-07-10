import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../service/article.service';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { PanierService } from '../service/panier.service';
import { FormsModule } from '@angular/forms'; //pour les soucis de ngmodel
import { ArticleRatingModalComponent } from '../article-rating-modal/article-rating-modal.component';
import { RatingData } from '../service/article.interface';
import { AuthentificationService } from '../service/authentification.service';

@Component({
  selector: 'app-article-vue',
  templateUrl: './article-vue.component.html',
  styleUrls: ['./article-vue.component.css'],
  imports: [
    NgFor,
    NgClass,
    NgIf,
    FormsModule,
    CommonModule,
    ArticleRatingModalComponent]
})
export class ArticleVueComponent implements OnInit {
  //sert à déclarer la modale d'avis
  @ViewChild('ratingModal') ratingModal!: ArticleRatingModalComponent;
  //instancier les retours des fonctions
  article: any;
  stars: string[] = [];
  avis: RatingData[] = [];
  stocks: number[] = [];
  selectedQuantity: number = 1;
  selectedRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    protected articleService: ArticleService, //pour utiliser ses fonctions
    private panierService: PanierService, public authService: AuthentificationService,
    private router: Router) { }


  //éxecute à l'init
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Récupérez l'ID de l'URL
    if (id) {
      this.articleService.getArticleByObjectId(id).subscribe({
        next: (response) => {
          console.log(response)
          this.article = response.rs;
          this.stocks = this.articleService.getStock(this.article.stock);
          this.stars = this.articleService.starsArray(this.article.stars);
          this.avis = this.article.avis || {}
        },
        error: (error) => console.error('Erreur lors de la récupération de l\'article', error)
      });
    }
  }

  addArticleToCart(article_id: string) {
    this.panierService.addArticleToCart(article_id, this.selectedQuantity).subscribe({
      next: (res) => {
        if (!res.error) {
          this.router.navigate(['/user-cart'])
        }
      },
      error: (error) => console.error("Erreur lors de l'ajout", error)
    });
  }
}