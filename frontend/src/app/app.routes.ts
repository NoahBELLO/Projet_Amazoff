import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component';
import { ArticleVueComponent } from './article-vue/article-vue.component';
import { UserAccountPageComponent } from './user-account-page/user-account-page.component';
import { ArticleCreatePageComponent } from './article-create-page/article-create-page.component';
import { PanierVueComponent } from './panier-vue/panier-vue.component';
import { ArticleRatingModalComponent } from './article-rating-modal/article-rating-modal.component';
import { CommandesVueComponent } from './commandes-vue/commandes-vue.component';
import { SuperAdminPageComponent } from './super-admin-page/super-admin-page.component';
import { DirecteurPageComponent } from './directeur-page/directeur-page.component';
import { WalletPageComponent } from './wallet-page/wallet-page.component';


//import { PageNotFoundComponent} from './page-not-found-component/page-not-found-component.component'
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noauth.guard';

export const routes: Routes = [
  // Route par défaut, redirige vers /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Page de connexion
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Exemple de page après connexion
  { path: 'dashboard', component: DashboardComponent },
  { path: 'super-admin', component: SuperAdminPageComponent },
  { path: 'directeur', component: DirecteurPageComponent },

{ path: 'wallet', component: WalletPageComponent },



  //Articles 
  { path: 'article/:id', component: ArticleVueComponent },
  { path: 'rating', component: ArticleRatingModalComponent },
  { path: 'user-account/Article', component: ArticleCreatePageComponent},
  { path: 'user-account/Commandes', component: CommandesVueComponent },
        // { path: 'magasin', component: MagasinPageComponent },
        // { path: 'parametres', component: ParametresPageComponent },

  { path: 'register', component: ModaleInscriptionComponent},

  { path: 'user-account', component: UserAccountPageComponent},

  { path: 'user-cart', component: PanierVueComponent},


]  // Route pour les pages non trouvées
 // { path: '**', component: PageNotFoundComponent }

;