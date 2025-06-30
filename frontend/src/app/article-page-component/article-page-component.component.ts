import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
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
  @Input() articles: Article[] = [];
  searchKeys: string = ""
  filteredArticles: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    protected articleService: ArticleService) {}

  ngOnInit() {
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        const q = params.get('q')?.trim();
        if (q) {
          // vérifie si c'est une recherche ou une actualisation
          
          this.articleService.search(q).subscribe({
            next: res => this.articles = res.rs,
            error: err => console.error(err)
          });
        } else {
          this.articleService.search(this.searchKeys).subscribe({
          next: (response) => {
            if (!response.error) {
              this.articles = response.rs;
            } else {
              alert(response.error);
            }
          },
          error: (err) => {
            console.error('Erreur lors de la recherche', err);
          }
        });
      }
      });
      // this.articleService.getArticles().subscribe({
      //   next: (response) => {
      //     if (response.error == false) {
      //       this.articles = response.rs
      //     }
      //     else{
      //       alert(response.error)
      //     }
      //   },
      //   error: (error) =>{
      //     alert("Erreur lors de l'évaluation")
      //     console.error("Erreur lors de l'évaluation", error)
      //   }  
      // });
    }
}
  


