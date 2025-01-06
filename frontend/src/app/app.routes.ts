import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component';
//import { PageNotFoundComponent} from './page-not-found-component/page-not-found-component.component'


export const routes: Routes = [
  // Route par défaut, redirige vers /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Page de connexion
  { path: 'login', component: LoginComponent },

  // Exemple de page après connexion
  { path: 'dashboard', component: DashboardComponent },


  { path: 'register', component: ModaleInscriptionComponent}
  // Route pour les pages non trouvées
 // { path: '**', component: PageNotFoundComponent }

];