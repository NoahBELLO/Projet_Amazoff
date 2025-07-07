import { Component, OnInit } from '@angular/core';
import { MagasinService, Magasin } from '../../app/service/magasin.service';
import { ReactiveFormsModule, FormsModule, } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FilterPipe } from "../pipes/filter.pipe";

@Component({
  selector: 'app-super-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterPipe],
  templateUrl: './super-admin-page.component.html',
  styleUrls: ['./super-admin-page.component.css']
})
export class SuperAdminPageComponent implements OnInit {
  searchTerm: string = '';
  magasins: Magasin[] = [];

  constructor(private magasinService: MagasinService) { }

  ngOnInit(): void {
    this.loadMagasins();
  }

  loadMagasins(): void {
    this.magasinService.getMagasins().subscribe({
      next: (data) => {
        this.magasins = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des magasins', err);
      }
    });
  }

  openAddResponsable() {
    alert('Formulaire pour ajouter un responsable (à implémenter)');
  }

  voirMagasin(magasin: Magasin) {
    alert(`Voir les détails de ${magasin.nom} (à implémenter)`);
  }

  modifierResponsable(magasin: Magasin) {
    alert(`Modifier le responsable de ${magasin.nom} (à implémenter)`);
  }

  supprimerResponsable(magasin: Magasin) {
    if (confirm(`Supprimer le responsable de ${magasin.nom} ?`)) {
      // Logique de suppression à implémenter
      alert('Responsable supprimé (mock)');
    }
  }
}
