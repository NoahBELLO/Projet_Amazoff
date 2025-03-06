import { NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-page-component',
  imports: [NgFor, NgClass, RouterLink],
  templateUrl: './article-page-component.component.html',
  styleUrl: './article-page-component.component.css'
})
export class ArticlePageComponentComponent {
  stars: string[] = [];
  //le ! indique que la variable sera initialisée avant d'être utilisée
  @Input() article!: { id: string, name: string; image: string, prix: number; stars: number, reduction:number, description: string};

  constructor(
    private articleService: ArticleService) {}

  ngOnInit() {
    this.stars = this.articleService.starsArray(this.article.stars);
  }
}



