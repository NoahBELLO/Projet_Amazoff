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
    alert(`Voir détails de ${magasin.nom}`);
  }

  gererStock(magasin: Magasin): void {
    alert(`Gérer le stock de ${magasin.nom}`);
  }
}
