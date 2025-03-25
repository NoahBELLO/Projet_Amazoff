import { Component } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { NgFor } from '@angular/common';
import { RouterLink, RouterOutlet, Routes } from '@angular/router';

@Component({
  selector: 'app-user-account-page',
  imports: [TopbarComponent,
    NgFor,
    RouterLink,
  ],
  templateUrl: './user-account-page.component.html',
  styleUrl: './user-account-page.component.css'
})
export class UserAccountPageComponent {
  sections = [
    {label: "Article", description: "Ajouter un ou plusieurs articles"},
    {label: "Magasin", description: "Gérer le magasin"},
    {label: "Commandes", description: "Voir les commandes passées ou en cours"},
    {label: "Paramètres", description: "Réglagles du profil, autres"}
  ]
}

