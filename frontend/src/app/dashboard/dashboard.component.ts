import { Component, OnInit } from '@angular/core';
import { TopbarComponent} from "../topbar/topbar.component";
import { ArticlePageComponentComponent } from "../article-page-component/article-page-component.component";
import { NgFor } from '@angular/common';
import { ArticleService } from '../service/article.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  imports: [TopbarComponent,
     ArticlePageComponentComponent,
    NgFor]
})
export class DashboardComponent implements OnInit{
  constructor(private articleService: ArticleService){}
  articles: { name: string; image: string, prix: number; stars: number }[] = [];

  ngOnInit(){
    this.articles = this.articleService.getArticles()
  }


}
