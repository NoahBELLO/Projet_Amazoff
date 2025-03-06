import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../service/article.service';
import { TopbarComponent } from '../topbar/topbar.component';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-article-vue',
  templateUrl: './article-vue.component.html',
  styleUrls: ['./article-vue.component.css'],
  imports:[TopbarComponent, NgFor, NgClass, NgIf]
})
export class ArticleVueComponent implements OnInit {
  //instancier les retours des fonctions
  article: any;
  stars: string[] = []; 
  quantitees: number[] = [];

  constructor(
    private route: ActivatedRoute, 
    private articleService: ArticleService) {} //pour utiliser ses fonctions

    //éxecute à l'init
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.article = this.articleService.getArticleByObjectId(id);
        this.stars = this.articleService.starsArray(this.article.stars);
        this.quantitees = this.articleService.getStock(this.article.stock);
      }
    });
  }
}