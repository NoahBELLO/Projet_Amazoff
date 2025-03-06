import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../service/article.service';
import { TopbarComponent } from '../topbar/topbar.component';
import { ArticlePageComponentComponent } from '../article-page-component/article-page-component.component';

@Component({
  selector: 'app-article-vue',
  templateUrl: './article-vue.component.html',
  styleUrls: ['./article-vue.component.css'],
  imports:[TopbarComponent, ArticlePageComponentComponent]
})
export class ArticleVueComponent implements OnInit {
  article: any;

  constructor(private route: ActivatedRoute, private articleService: ArticleService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.article = this.articleService.getArticleByObjectId(id);
      }
    });
  }
}