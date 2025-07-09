import { Component } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { ArticleService } from '../service/article.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-article-create-page',
  imports: [FormsModule],
  templateUrl: './article-create-page.component.html',
  styleUrl: './article-create-page.component.css'
})
export class ArticleCreatePageComponent {
  articleDatas: any = {};
  selectedFile: File | null = null;

  constructor(private articleService: ArticleService) { } //pour utiliser ses fonctions

  onClickSave() {
    /* if (this.selectedFile) {
      this.articleDatas.image = this.selectedFile.name;
    } else {
      this.articleDatas.image = null;
    }
  
    this.articleService.createArticle(this.articleDatas).subscribe({
      next: (response) => {
        console.log('Article enregistré', response);
        alert("Article enregistré avec succès")
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement', error);
      }
    }); */
    const formData = new FormData();
    formData.append('name', this.articleDatas.name);
    formData.append('description', this.articleDatas.description);
    formData.append('prix', this.articleDatas.prix);
    formData.append('reduction', this.articleDatas.reduction);
    formData.append('stock', this.articleDatas.stock);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.articleService.createArticle(formData).subscribe({
      next: (response) => {
        console.log('Article enregistré', response);
        alert("Article enregistré avec succès");
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement', error);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
          imagePreview.setAttribute('src', e.target.result);
          imagePreview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  }


}

