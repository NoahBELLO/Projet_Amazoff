import { Component, OnInit, Input } from '@angular/core';
import { TopbarComponent} from "../topbar/topbar.component";
import { ArticlePageComponentComponent } from "../article-page-component/article-page-component.component";
import { NgFor } from '@angular/common';
import { ArticleService } from '../service/article.service';
import { Article } from '../service/article.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  imports: [TopbarComponent,
     ArticlePageComponentComponent,
    ]
})
export class DashboardComponent implements OnInit{
  articles: Article[] = []; // Initialisez comme un tableau vide

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.articleService.getArticles().subscribe(
      (data: Article[]) => {
        this.articles = data; // Assurez-vous que data est un tableau
        console.log('Articles dans le composant:', this.articles);
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles', error);
      }
    );
  }
}
