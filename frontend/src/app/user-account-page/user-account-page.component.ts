import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet, Routes } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { ArticleCreatePageComponent } from '../article-create-page/article-create-page.component';
import { CommandesVueComponent } from '../commandes-vue/commandes-vue.component';

@Component({
  selector: 'app-user-account-page',
  imports: [
    TopbarComponent, SideBarComponent,
    ArticleCreatePageComponent, CommandesVueComponent, NgIf
  ],
  templateUrl: './user-account-page.component.html',
  styleUrl: './user-account-page.component.css'
})
export class UserAccountPageComponent implements OnInit {
  /* sections = [
    { label: "Article", description: "Ajouter un ou plusieurs articles" },
    { label: "Magasin", description: "Gérer le magasin" },
    { label: "Commandes", description: "Voir les commandes passées ou en cours" },
    { label: "Paramètres", description: "Réglagles du profil, autres" }
  ] */
  sections: any[] = [];
  activeSection = '';

  constructor(private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
    // Exemple : adapter selon le rôle
    // const role = this.authService.getRole(); // À adapter selon votre service
    this.sections = [
      { label: "Commandes", key: "Commandes" },
      { label: "Article", key: "Article" },
      // Ajoutez selon le rôle
      { label: "Magasin", key: "Magasin" },
      { label: "Paramètres", key: "Paramètres" }
    ];
  }

  setActiveSection(key: string) {
    this.activeSection = key;
  }
}

