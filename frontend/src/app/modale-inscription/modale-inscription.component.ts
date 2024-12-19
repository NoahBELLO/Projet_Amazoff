import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-modale-inscription',
  imports: [NgIf, FormsModule],
  templateUrl: './modale-inscription.component.html',
  styleUrl: './modale-inscription.component.css'
})

export class ModaleInscriptionComponent {

  isModalOpen = false;

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  onSubmit(form: NgForm) {
    console.log(form.value) //pour l'instant dans la modale
  }

}