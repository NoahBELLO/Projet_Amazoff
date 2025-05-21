import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { RouterLink } from '@angular/router';
import { Article } from '../service/article.interface';

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
    protected articleService: ArticleService) {}

    ngOnInit() {
      this.articleService.getArticles().subscribe(
        (data: Article[]) => {
          this.articles = data; //enregistrement des articles dans le  tableau articles
        },
        (error) => {
          console.error('Erreur lors de la récupération des articles', error);
        }
      );
      
    }
  }


