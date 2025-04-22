import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../service/article.service';
import { TopbarComponent } from '../topbar/topbar.component';
import { Article } from '../service/article.interface';
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
      const id = this.route.snapshot.paramMap.get('id'); // Récupérez l'ID de l'URL
      if (id) {
        this.articleService.getArticleByObjectId(id).subscribe(
          (data: Article) => {
            this.article = data;
          },
          (error) => {
            console.error('Erreur lors de la récupération de l\'article', error);
          }
        );
      }
}
}