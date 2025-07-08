import { Component, Input } from '@angular/core';
import { Article } from "../../service/article.interface"
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panier-preview',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './panier-preview.component.html',
  styleUrl: './panier-preview.component.css'
})
export class PanierPreviewComponent {
  @Input() articles: Article[] = [];
}
