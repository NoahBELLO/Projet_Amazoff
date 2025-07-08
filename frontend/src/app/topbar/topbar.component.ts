import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PanierService } from '../service/panier.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article, ResponseApi } from '../service/article.interface';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../service/article.service';
import { UserService } from '../service/user.service';
import { AuthentificationService } from '../service/authentification.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, NgIf, FormsModule, AsyncPipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})

export class TopbarComponent {
  nombreArticles$!: Observable<number>;
  // nombreNotifications$!: Observable<number>;
  searchQuery: string = '';
  @Output() searchEvent = new EventEmitter<string>();
  fname: string = "";
  name: string = "";

  constructor(
    protected panierService: PanierService,
    protected articleService: ArticleService,
    private router: Router, private userService: UserService, public authService: AuthentificationService) {
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

    // let userId = '67371b2d1ed69fcb550f15e5';
    this.authService.checkCookie().subscribe({
      next: (response) => {
        this.userService.infoUser(response.userId).subscribe({
          next: (user) => {
            this.fname = user.fname;
            this.name = user.name;
          },
          error: (error) => {
            console.error("Erreur lors de la récupération des informations utilisateur :", error);
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
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
    this.articleService.search(this.searchQuery).subscribe({
      next: (response) => {
        // navigue vers /dashboard en mettant la recherche
        this.router.navigate(['/dashboard'], {
          queryParams: { q: this.searchQuery }
        });
        console.log(response)
      },
      error: (err) => {
        console.error('Erreur lors du chargement du panier', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }

  userAccount() {
    this.authService.checkCookie().subscribe({
      next: (response) => {
        this.router.navigate(['/user-account']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.fname = "";
          this.name = "";
          this.router.navigate(['/login']);
        }
      }
    });
  }
}

