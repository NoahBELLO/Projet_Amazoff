import { Component, OnInit, Input } from '@angular/core';
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
  @Input() articles: any;
  @Input() stars: any;

  constructor(private articleService: ArticleService){}

  ngOnInit(){
    this.articleService.fetchAndStoreArticles();
    this.articles = this.articleService.getStoredArticles();    
  }


}
