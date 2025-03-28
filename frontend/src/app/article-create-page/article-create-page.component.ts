import { Component } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { ArticleService } from '../service/article.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-article-create-page',
  imports: [TopbarComponent, FormsModule],
  templateUrl: './article-create-page.component.html',
  styleUrl: './article-create-page.component.css'
})
export class ArticleCreatePageComponent{
  articleDatas: any = {};

  constructor(private articleService: ArticleService) {} //pour utiliser ses fonctions
  
    onClickSave(){
      console.log(this.articleDatas)
      this.articleService.createArticle(this.articleDatas).subscribe(
        response =>{
          console.log('Article enregistré', response)
          return response
        }
      );
    }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePreview = document.getElementById('image-preview');
    // if (imagePreview) {
    //   imagePreview.src = e.target.result;
    //   imagePreview.style.display = 'block';
    // }
      };
      reader.readAsDataURL(file);
    }
  }


}

