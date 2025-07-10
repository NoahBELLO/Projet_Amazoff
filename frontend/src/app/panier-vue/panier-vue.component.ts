import { Component } from '@angular/core';
import { PanierService } from '../service/panier.service';
import { Article } from '../service/article.interface';
import { TopbarComponent } from "../topbar/topbar.component";
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ArticleService } from '../service/article.service';
import { FormsModule } from '@angular/forms';//pour les soucis de ngmodel
import { Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';


@Component({
  selector: 'app-panier-vue',
  imports: [NgFor, NgIf, FormsModule, RouterLink, AsyncPipe],
  templateUrl: './panier-vue.component.html',
  styleUrl: './panier-vue.component.css'
})
export class PanierVueComponent {
  // panier: Article[] = []; //liste d'article = au panier
  panier$: Observable<Article[]>;
  error: boolean = false;
  message: string = '';
  quantitee: number[] = []
  popupPaiementOuvert: boolean = false;
  paiement: {
    numeroCarte: string; nomCarte: string;
    expiration: string; cvv: string;
  } = {
      numeroCarte: '', nomCarte: '',
      expiration: '', cvv: ''
    };

  constructor(
    private panierService: PanierService,
    private articleService: ArticleService,
    private router: Router, public authService: AuthentificationService
  ) {
    this.panier$ = this.panierService.panierUser$;
  }

  // ngOnInit() {
  //   this.panierService.getPanierUser().subscribe(
  //     (response) => {
  //       if (!response.error) {
  //         this.panier = response.rs.articles.map((article: { stock: any; }) => ({
  //           ...article,
  //           stock: article.stock
  //         }));
  //       } else {
  //         this.error = response.error;
  //         this.message = response.message || 'Erreur inconnue';
  //       }
  //     },
  //     (err) => {
  //       this.error = true;
  //       this.message = 'Erreur lors de la récupération du panier';
  //       console.error(err);
  //     }
  //   );
  // }


  removeFromPanier(articleId: string): void {
    this.panierService.removeArticleFromCart(articleId).subscribe({
      next: (response) => {
        if (!response.error) {
          console.log("succès")
          window.location.reload(); //rafraichis la page
        }
      },
      error: (error) => {
        alert(error)
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }

  getQuantityOptions(article: Article): number[] {
    const stock: number[] = [];
    for (let i = 1; i <= article.stock; i++) {
      stock.push(i);
    }
    return stock;
  }


  modifyQuantite(article: Article) {
    this.panierService.updateQuantiteUtilisateur(article).subscribe({
      next: (response) => {
        if (!response.error) {
          article.sous_total = article.prix * article.quantite_utilisateur!;
          window.location.reload();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }

  getTotal(panier: Article[]): number {
    return panier.reduce((sum: number, article: Article) => sum + (article.sous_total ?? 0), 0);
  }

  ouvrirPopupPaiement() {
    this.popupPaiementOuvert = true;
  }

  fermerPopupPaiement() {
    this.popupPaiementOuvert = false;
  }

  validerPaiement() {
    console.log("Paiement validé avec les informations suivantes :", this.paiement);
    this.authService.checkCookie().subscribe({
      next: (response) => {
        this.panier$.subscribe(panier => {
          const total = this.getTotal(panier);
          const paiementBody = {
            userId: response.userId,
            method: "cb",
            details: JSON.stringify({
              numeroCarte: this.paiement.numeroCarte,
              nomCarte: this.paiement.nomCarte,
              expiration: this.paiement.expiration,
              cvv: this.paiement.cvv,
              total: total
            })
          };

          this.panierService.creerPaiement(paiementBody).subscribe((paiementRes: any) => {
            const paiementId = paiementRes._id;
            const commandes = panier.map(article => ({
              article_id: article.id,
              name: article.name,
              quantite: article.quantite_utilisateur,
              prix: article.prix,
              image: article.image,
              reduction: article.reduction,
              sous_total: article.sous_total
            }));

            const commande = {
              commandes: commandes,
              total: total,
              paiement: "CB VISA",
              paiement_id: paiementId,
              user_id: response.userId,
              date_publication: new Date().toISOString()
            };

            this.panierService.creerCommande(commande, response.userId).subscribe((commandeRes: any) => {
              this.panierService.viderPanier(response.userId).subscribe(() => {
                this.popupPaiementOuvert = false;
                this.router.navigate(['/user-account']);
              });
            });
          });
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }

}
