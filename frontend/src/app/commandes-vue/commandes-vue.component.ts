import { Component, ViewChild } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { CommandeService } from '../service/commande.service';
import { ArticleRatingModalComponent } from '../article-rating-modal/article-rating-modal.component';
import { CommandeEnCours, CommandeLivrees } from '../service/commandes.interface';
import { NgFor } from '@angular/common';
import { CommandeBlocComponent } from '../commande-bloc/commande-bloc.component';

@Component({
  selector: 'app-commandes-vue',
  imports: [NgFor,
    TopbarComponent,
    CommandeBlocComponent,
    ArticleRatingModalComponent
  ],
  templateUrl: './commandes-vue.component.html',
  styleUrl: './commandes-vue.component.css'
})
export class CommandesVueComponent {
  commandes_en_cours: CommandeEnCours [] = [];
  commandes_livrees: CommandeLivrees [] = [];

  constructor(
    // @ViewChild('ratingModal') ratingModal!: ArticleRatingModalComponent;
    
    private commandeService: CommandeService,
  ){}

  ngOnInit(){
    this.commandeService.getCommandesEnCours().subscribe({
      next: (response) => {
        console.log(response)
        this.commandes_en_cours = response.rs
      },
      error: (error: any) => console.error("Erreur lors de la récupération des commandes", error)
    })
    
    this.commandeService.getCommandesLivrees().subscribe({
      next: (response) => {
        this.commandes_livrees = response.rs
        console.log(response)
      },
      error: (error: any) => console.error("Erreur lors de la récupération des commandes", error)
    })
  }
}
