import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PanierService } from '../service/panier.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article, ResponseApi } from '../service/article.interface';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../service/article.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, NgIf,FormsModule, AsyncPipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})

export class TopbarComponent {
  nombreArticles$!: Observable<number>;
  searchQuery: string = '';
  @Output() searchEvent = new EventEmitter<string>();

  constructor(
    protected panierService: PanierService,
    protected articleService: ArticleService,
    private router: Router) 
    {
      this.nombreArticles$ = this.panierService.getNombreArticlesAuPanier();
     }

  ngOnInit(): void {
    this.panierService.getPanierUser().subscribe({
      next: (response) => {
      },
      error: (err) => {
        console.error('Erreur lors du chargement du panier', err);
      }
    });

    this.nombreArticles$ = this.panierService.getNombreArticlesAuPanier();

    // s'abonne aux changements du nombre d'articles
    this.nombreArticles$.subscribe();
  }

  goToDashboard() {
  if (this.router.url === '/dashboard') {
    // force le "rafraîchissement" en naviguant ailleurs puis en revenant
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  } else {
    this.router.navigate(['/dashboard']);
  }
}

  recherche_article() {
    this.searchEvent.emit(this.searchQuery);
    // this.articleService.search(this.searchQuery).subscribe({
    //   next: (response) => {
    //     console.log(response)
    //   },
    //   error: (err) => {
    //     console.error('Erreur lors du chargement du panier', err);
    //   }
    // });
  }

}

