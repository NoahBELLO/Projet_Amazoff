import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importer HttpClientModule
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ArticleService } from './service/article.service';
import { Article } from './service/article.interface';



//Le module HttpClientModule permet 
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, CommonModule, HttpClientModule, TopbarComponent]
})

export class AppComponent {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  title = 'AmazOff';
  constructor(private articleService: ArticleService) { }
  onSearch(searchKeys: string) {
    console.log('onSearch capté', searchKeys)
    this.articleService.search(searchKeys).subscribe({
      next: (response) => {
        if (!response.error) {
          this.filteredArticles = response.rs;
        } else {
          alert(response.error);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la recherche', err);
      }
    });
  }
}
