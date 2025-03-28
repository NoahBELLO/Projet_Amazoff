import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { RouterLink } from '@angular/router';
import { Article } from '../service/article.model';

@Component({
  selector: 'app-article-page-component',
  imports: [NgFor, NgClass, RouterLink],
  templateUrl: './article-page-component.component.html',
  styleUrl: './article-page-component.component.css'
})
export class ArticlePageComponentComponent implements OnInit {
  @Input() article?: Article;
  stars: string[] = [];
  articles: Article[] = [];

  constructor(
    private articleService: ArticleService) {}

    ngOnInit() {
      this.articleService.getArticles().subscribe(
        (data: Article[]) => {
          this.articles = data; //enregistrement des articles dans le  tableau articles
          console.log("articles = ", this.articles)
          if (this.article) {
            this.stars = this.articleService.starsArray(this.article.stars);
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des articles', error);
        }
      );
    }
  }


