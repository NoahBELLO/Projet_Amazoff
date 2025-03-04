import { Component } from '@angular/core';
import { TopbarComponent} from "../topbar/topbar.component";
import { ArticlePageComponentComponent } from "../article-page-component/article-page-component.component";
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  imports: [TopbarComponent,
     ArticlePageComponentComponent,
    NgFor]
})
export class DashboardComponent {}
