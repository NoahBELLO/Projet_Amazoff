import { Component, NgModule, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { AuthentificationService } from '../service/authentification.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list-page',
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './user-list-page.component.html',
  styleUrl: './user-list-page.component.css'
})

export class UserListPageComponent implements OnInit {
  users: any[] = [];
  currentUserRoles: string[] = [];
  roles: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthentificationService
  ) { }

  ngOnInit() {
    this.authService.getRole().subscribe(roles => {
      this.currentUserRoles = Array.isArray(roles) ? roles.filter((r): r is string => r !== null) : [roles].filter((r): r is string => r !== null);
      this.loadUsers();
      this.loadRoles();
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users.map((u: any) => ({
        ...u,
        selectedRole: Array.isArray(u.role) ? u.role[0] : u.role // adapte selon ton modèle
      }));
    });
  }

  loadRoles() {
    this.userService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  getRoleNames(roleIds: string[] | string | undefined): string {
    if (!roleIds || !Array.isArray(this.roles) || this.roles.length === 0) return '';
    const ids = Array.isArray(roleIds) ? roleIds : [roleIds];
    return ids
      .map(id => this.roles.find(r => r._id === id)?.name || id)
      .map(name => this.getRoleLabel(name))
      .join(', ');
  }

  canEditRoles(): boolean {
    return this.currentUserRoles.includes('admin') || this.currentUserRoles.includes('superuser') ||
      this.currentUserRoles.includes('responsableMagasin') || this.currentUserRoles.includes('directeurMagasin');
  }

  getEditableRoles(): string[] {
    if (this.currentUserRoles.includes('admin') || this.currentUserRoles.includes('superuser')) {
      return ['employee', 'responsableMagasin', 'directeurMagasin', 'admin', 'superuser', 'client'];
    }
    if (this.currentUserRoles.includes('responsableMagasin') || this.currentUserRoles.includes('directeurMagasin')) {
      return ['employee', 'responsableMagasin', 'directeurMagasin'];
    }
    return [];
  }

  // Utilisez cette méthode pour changer le rôle d'un utilisateur
  onRoleChange(user: any) {
    const userId = user._id ?? user.id;
    this.userService.updateUserRole(userId, user.selectedRole).subscribe(() => {
      user.role = user.selectedRole;
    });
  }

  getSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'employee': return 'Employé';
      case 'responsableMagasin': return 'Responsable magasin';
      case 'directeurMagasin': return 'Directeur magasin';
      case 'admin': return 'Administrateur';
      case 'superuser': return 'Super utilisateur';
      case 'client': return 'Client';
      default: return role;
    };
  }

  onDeleteUser(user: any) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(user._id ?? user.id).subscribe(
        () => {
          this.users = this.users.filter(u => u._id !== user._id);
          window.location.reload();
        },
        (error: any) => {
          window.location.reload();
        }
      );
    }
  }

  canDeleteUsers(): boolean {
    // Seuls certains rôles peuvent supprimer
    return this.currentUserRoles.includes('admin') || this.currentUserRoles.includes('superuser');
  }
}
