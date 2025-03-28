import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-page-component',
  imports: [NgFor, NgClass, RouterLink],
  templateUrl: './article-page-component.component.html',
  styleUrl: './article-page-component.component.css'
})
export class ArticlePageComponentComponent implements OnInit {
  stars: string[] = [];
  //le ! indique que la variable sera initialisée avant d'être utilisée
  // définir les champs optionnels avec '?'
  @Input() article!: {
    id: string;
    name: string;
    image?: string; // Champ optionnel
    prix: number;
    stars: number;
    reduction?: number; // Champ optionnel
    description?: string; // Champ optionnel
  };
  @Input() articles: any;

  constructor(
    private articleService: ArticleService) {}

  ngOnInit() {
    if (this.article) {
      this.stars = this.articleService.starsArray(this.article.stars);
      this.articles = this.articleService.getStoredArticles();    

    }

  }
}



