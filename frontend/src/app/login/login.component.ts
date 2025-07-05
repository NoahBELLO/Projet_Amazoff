import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaireComponent } from '../components/formulaire/formulaire.component';
import { NgIf } from '@angular/common';
import { AuthentificationService } from '../service/authentification.service';

@Component({
  selector: 'app-connexion',
  imports: [NgIf, FormsModule, FormulaireComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthentificationService) { }
  typeForm: string = "login";

  formulaireLogin() {
    this.typeForm = "login";
  }

  formulaireRegister() {
    this.typeForm = "register";
  }

  connexionGoogle() {
    window.location.href = "http://localhost:3001/authentification/google";
  }
}
