import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthentificationService } from '../../service/authentification.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupErreurComponent } from '../popup-erreur/popup-erreur.component';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.css'
})
export class FormulaireComponent implements OnChanges {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder, private routes: Router, private authService: AuthentificationService) {
    this.loginForm = this.fb.group({
      identifiant: ['', [Validators.required]],
      motDePasse: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      fname: ['', [Validators.required]],
      adress: ['', [Validators.required]],
      email: ['', [Validators.required]],
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  @Input() data: any;
  baseWidth: number = 300;
  baseHeight: number = 200;
  baseWidthErreur: number = 500;
  baseHeightErreur: number = 182;

  ngOnChanges(changes: SimpleChanges): void { }

  onSubmit() {
    switch (this.data) {
      case 'login':
        if (!this.loginForm.valid) {
          this.dialog.open(PopupErreurComponent, {
            width: `${this.baseWidthErreur}px`,
            height: `${this.baseHeightErreur}px`,
            data: "Connexion non réussie. Veuillez remplir les champs requis."
          });
          return;
        }
        const { identifiant, motDePasse } = this.loginForm.value;
        this.informationsLogin(identifiant, motDePasse);
        break;

      case 'register':
        if (!this.registerForm.valid) {
          this.dialog.open(PopupErreurComponent, {
            width: `${this.baseWidthErreur}px`,
            height: `${this.baseHeightErreur}px`,
            data: "Inscription non réussie. Veuillez remplir les champs requis."
          });
          return;
        }
        const { name, fname, adress, email, login, password, confirmPassword } = this.registerForm.value;
        this.informationsRegister(name, fname, adress, email, login, password, confirmPassword);
        break;

      default:
        console.log("Type de données non valide.");
    }
  }

  informationsLogin(identifiant: string, motDePasse: string): void {
    this.authService.hashSHA256(motDePasse).then(hash => {
      const body = { identifiant, motDePasse: hash };
      this.authService.login(body).subscribe({
        next: (response) => {
          window.location.reload(); 
          this.routes.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error("Erreur lors de la requête Flag :", error);
        }
      });
    });
  }

  informationsRegister(name: string, fname: string, adress: string, email: string, login: string, password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      console.error("Les mots de passe ne correspondent pas.");
      return;
    }

    this.authService.hashSHA256(password).then(hash => {
      const body = { name, fname, adress, email, login, motDePasse: hash };
      this.authService.register(body).subscribe({
        next: (response) => {
          this.routes.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error("Erreur lors de la requête Flag :", error);
        }
      });
    });
  }
}