import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet, Routes } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { ArticleCreatePageComponent } from '../article-create-page/article-create-page.component';
import { CommandesVueComponent } from '../commandes-vue/commandes-vue.component';
import { SuperAdminPageComponent } from '../super-admin-page/super-admin-page.component';
import { SettingsPageComponent } from '../setting-page/setting-page.component';
import { ArticlesListComponent } from '../articles-list/articles-list.component';
import { DirecteurPageComponent } from '../directeur-page/directeur-page.component';
import { UserListPageComponent } from '../user-list-page/user-list-page.component';

@Component({
  selector: 'app-user-account-page',
  imports: [
    SideBarComponent,
    ArticleCreatePageComponent, CommandesVueComponent, NgIf,
    ArticlesListComponent, DirecteurPageComponent,
    SuperAdminPageComponent, SettingsPageComponent, UserListPageComponent
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
  userRoles: string[] = [];
  activeSection = '';

  constructor(private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
    this.authService.getRole().subscribe((roles) => {
      this.userRoles = Array.isArray(roles) ? roles.filter((r): r is string => r !== null) : [roles].filter((r): r is string => r !== null);

      const sectionsSet = new Set<any>();
      this.userRoles.forEach(role => {
        if (role === 'admin' || role === 'superuser') {
          // sectionsSet.add(JSON.stringify({ label: "Commandes", key: "Commandes" }));
          sectionsSet.add(JSON.stringify({ label: "Liste des articles", key: "ListeArticles" }));
          sectionsSet.add(JSON.stringify({ label: "Liste des magasins", key: "ListeMagasins" }));
          sectionsSet.add(JSON.stringify({ label: "Listes des utilisateurs", key: "Utilisateurs" }));
          sectionsSet.add(JSON.stringify({ label: "Paramètres", key: "Paramètres" }));
          this.activeSection = "Utilisateurs";
        } else if (role === 'responsableMagasin' || role === 'directeurMagasin') {
          // sectionsSet.add(JSON.stringify({ label: "Commandes", key: "Commandes" }));
          sectionsSet.add(JSON.stringify({ label: "Ajouter un article", key: "AjoutArticle" }));
          sectionsSet.add(JSON.stringify({ label: "Liste des articles", key: "ListeArticles" }));
          sectionsSet.add(JSON.stringify({ label: "Mon magasin", key: "Magasin" }));
          sectionsSet.add(JSON.stringify({ label: "Listes des utilisateurs", key: "Utilisateurs" }));
          sectionsSet.add(JSON.stringify({ label: "Paramètres", key: "Paramètres" }));
          this.activeSection = "Magasin";
        } else if (role === 'employee') {
          // sectionsSet.add(JSON.stringify({ label: "Commandes", key: "Commandes" }));
          sectionsSet.add(JSON.stringify({ label: "Liste des articles", key: "ListeArticles" }));
          sectionsSet.add(JSON.stringify({ label: "Ajouter un article", key: "AjoutArticle" }));
          sectionsSet.add(JSON.stringify({ label: "Paramètres", key: "Paramètres" }));
          this.activeSection = "ListeArticles";
        }
      });
      const forbiddenRoles = ['employee', 'responsableMagasin', 'directeurMagasin', 'admin', 'superuser'];
      if (
        this.userRoles.includes('client') &&
        !this.userRoles.some(role => forbiddenRoles.includes(role))
      ) {
        sectionsSet.add(JSON.stringify({ label: "Commandes", key: "Commandes" }));
        sectionsSet.add(JSON.stringify({ label: "Paramètres", key: "Paramètres" }));
        this.activeSection = "Commandes";
      }

      this.sections = Array.from(sectionsSet).map(s => JSON.parse(s));
    });
  }

  setActiveSection(key: string) {
    this.activeSection = key;
  }
}

