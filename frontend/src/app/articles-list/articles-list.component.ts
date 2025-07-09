import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { Article } from '../service/article.interface';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-articles-list',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = [];
  @Input() userRoles: string[] = [];
  popupVisible = false;
  articleToEdit: Article | null = null;
  articleForm: any;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private articleService: ArticleService) {
    this.articleForm = this.fb.group({
      id: [''],
      id_magasin: [''],
      name: [''],
      description: [''],
      price: [''],
      stock: [''],
      reduction: [''],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.articleService.search("").subscribe({
      next: (response) => {
        if (!response.error) {
          // console.log('Articles trouvés:', response.rs);
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

  canEditOrDelete(): boolean {
    const allowedRoles = ['admin', 'superuser', 'responsableMagasin', 'directeurMagasin'];
    return this.userRoles.some(role => allowedRoles.includes(role));
  }

  editArticle(article: Article) {
    this.articleToEdit = { ...article }; // clone pour ne pas modifier directement
    this.popupVisible = true;
  }

  saveEdit() {
    if (this.articleToEdit) {
      const formData = new FormData();
      formData.append('id', this.articleToEdit.id);
      formData.append('id_magasin', this.articleToEdit.id_magasin ?? '');
      formData.append('name', this.articleToEdit.name);
      formData.append('description', this.articleToEdit.description);
      formData.append('prix', this.articleToEdit.prix.toString());
      formData.append('reduction', (this.articleToEdit.reduction !== undefined ? this.articleToEdit.reduction.toString() : '0'));
      formData.append('stock', this.articleToEdit.stock.toString());
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.articleService.updateArticle(formData).subscribe({
        next: (response) => {
          console.log('Réponse de la mise à jour:', response);
          if (!response.error) {
            const updatedArticle = response.rs?.article ?? this.articleToEdit!;
            const idx = this.articles.findIndex(a => a.id === updatedArticle.id);
            if (idx !== -1) this.articles[idx] = { ...updatedArticle };
            this.closePopup();
          } else {
            alert('Erreur lors de la modification : ' + response.message);
          }
        },
        error: (err) => {
          alert('Erreur lors de la modification');
          console.error(err);
        }
      });
    }
  }

  closePopup() {
    this.popupVisible = false;
    this.articleToEdit = null;
  }

  deleteArticle(article: Article) {
    if (confirm('Supprimer cet article ?')) {
      this.articleService.deleteArticle(article.id).subscribe({
        next: (response) => {
          if (!response.error) {
            // Retire l'article de la liste locale
            this.articles = this.articles.filter(a => a.id !== article.id);
          } else {
            alert('Erreur lors de la suppression : ' + response.message);
          }
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }
}
