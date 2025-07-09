import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthentificationService } from '../service/authentification.service';
import { UserService } from '../service/user.service';
import { NotificationsService } from '../service/notifications.service';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingsPageComponent implements OnInit {
  userForm: FormGroup;
  user: any;

  constructor(private fb: FormBuilder, private authService: AuthentificationService, private notificationService: NotificationsService, private userService: UserService) {
    this.userForm = this.fb.group({
      name: [''],
      fname: [''],
      adress: [''],
      email: [''],
      login: [''],
      password: ['']
    });
  }

  ngOnInit() {
    this.authService.checkCookie().subscribe({
      next: (response) => {
        this.userService.infosUser(response.userId).subscribe({
          next: (user) => {
            this.user = user;
            this.userForm.patchValue({
              name: user.name,
              fname: user.fname,
              adress: user.adress,
              email: user.email,
              login: user.login
            });
          },
          error: (error) => {
            console.error("Erreur lors de la récupération des informations utilisateur :", error);
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }

  onSave() {
    this.authService.checkCookie().subscribe({
      next: (response) => {
        this.userService.updateUser(response.userId, this.userForm.value).subscribe({
          next: (user: any) => {
            alert('Informations mises à jour !');
            window.location.reload();
          },
          error: (error: any) => {
            console.error("Erreur lors de la récupération des informations utilisateur :", error);
          }
        });
      },
      error: (error: any) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }

  onDeleteRequest() {
    this.authService.checkCookie().subscribe({
      next: (response) => {
        this.userService.deleteUser(response.userId).subscribe({
          next: (user: any) => {
            alert('Compte supprimée !');
            window.location.reload();
          },
          error: (error: any) => {
            console.error("Erreur lors de la récupération des informations utilisateur :", error);
          }
        });
      },
      error: (error: any) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }
}