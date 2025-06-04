import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PanierService } from '../service/panier.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from '../service/article.interface';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})

export class TopbarComponent {
  nombreArticles$!: Observable<number>;

  constructor(
    protected panierService: PanierService) 
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

    // S'abonner aux changements du nombre d'articles
    this.nombreArticles$.subscribe();
  }


}

