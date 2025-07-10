import { Component, OnInit, Input } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { ArticlePageComponentComponent } from "../article-page-component/article-page-component.component";
import { NgFor } from '@angular/common';
import { ArticleService } from '../service/article.service';
import { Article, ResponseApi } from '../service/article.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  imports: [
    ArticlePageComponentComponent,
  ]
})
export class DashboardComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];


  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.onSearch("");

    // this.articleService.getArticles().subscribe(
    //   (response: ResponseApi) => {
    //     this.articles = response.rs;
    //   },
    //   (error) => {
    //     console.error('Erreur lors de la récupération des articles', error);
    //   }
    // );
  }

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

