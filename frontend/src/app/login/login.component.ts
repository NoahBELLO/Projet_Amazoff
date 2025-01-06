import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../app/service/auth.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private routes: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;
      this.authService.login(login, password).subscribe({
        next: (response: { token: string; }) => {
          if (response.token) {
            localStorage.setItem('token', response.token); // Sauvegarde le token
            this.routes.navigate(['/dashboard']); // Redirige l'utilisateur
          } else {
            alert('Erreur : Aucun token reçu.');
          }
        },
        error: (err: any) => {
          alert('Login ou mot de passe incorrect.');
          console.error('Erreur lors de la connexion :', err);
        },
      });
    }
  }
}
  