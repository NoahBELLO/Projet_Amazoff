import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-article-create-page',
  imports: [TopbarComponent],
  templateUrl: './article-create-page.component.html',
  styleUrl: './article-create-page.component.css'
})
export class ArticleCreatePageComponent{
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePreview = document.getElementById('image-preview');

      };
      reader.readAsDataURL(file);
    }
  }

}

