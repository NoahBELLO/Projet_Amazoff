import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commande-retour',
  imports: [FormsModule, CommonModule],
  templateUrl: './commande-retour.component.html',
  styleUrl: './commande-retour.component.css'
})
export class CommandeRetourComponent {
  @Input() articleId!: string;
  selectedReason: string = '';
  isModalOpen: boolean = false;

  reasons: string[] = [
    'Article endommagé',
    'Pièces ou accessoires manquants',
    'Description erronée sur le site',
    "L'article est défectueux ou ne fonctionne pas",
    'Achat effectué par erreur',
    'Achat non autorisé',
    'Performances ou qualité non adéquates',
    "L'article et la boite d'expédition sont endommagés",
    'Meilleur prix trouvé ailleurs',
    'Autre'
  ];

  openModal(articleId: string): void {
    this.isModalOpen = true;
    this.selectedReason = '';
    this.articleId = articleId
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitReturn() {
    if (!this.selectedReason) {
      alert('Veuillez sélectionner une raison de retour.');
      return;
    }
    console.log('Retour demandé pour l\'article :', this.articleId, 'Raison :', this.selectedReason);

  }
}
