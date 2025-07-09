import { Component, OnInit } from '@angular/core';
import { MagasinService, Magasin } from '../../app/service/magasin.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FilterMagasinsPipe } from "../pipes/filter.pipe";

@Component({
  selector: 'app-directeur-page',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, FilterMagasinsPipe],
  templateUrl: './directeur-page.component.html',
  styleUrls: ['./directeur-page.component.css']
})
export class DirecteurPageComponent implements OnInit {
  searchTerm = '';
  magasins: Magasin[] = [];
  selectedMagasin: Magasin | null = null;
  popupType: 'voir' | 'edit' | null = null;
  //@dur
  readonly responsableEmail = 'widad@amazoff.com';

  constructor(private magasinService: MagasinService) { }

  ngOnInit(): void {
    this.loadMagasins();
  }

  loadMagasins(): void {
    this.magasinService.getMagasins().subscribe({
      next: (data) => {
        this.magasins = data.filter(
          magasin => magasin.responsable_email === this.responsableEmail
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des magasins', err);
      }
    });
  }

  voirDetails(magasin: Magasin): void {
    this.selectedMagasin = magasin;
    this.popupType = 'voir';
  }

  fermerPopup(): void {
    this.selectedMagasin = null;
    this.popupType = null;
  }

  /* editerMagasin(magasin: Magasin): void {
    this.selectedMagasin = { ...magasin }; // clone pour éviter la modification directe
    this.popupType = 'edit';
  } */

  /* sauvegarderModifications(magasin: Magasin): void {
    this.magasinService.updateMagasin(magasin).subscribe({
      next: (updated) => {
        const index = this.magasins.findIndex(m => m._id === updated._id);
        if (index !== -1) this.magasins[index] = updated;
        this.fermerPopup();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du magasin', err);
      }
    });
  } */
}
