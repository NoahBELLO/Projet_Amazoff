import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component';
import { TopbarComponent } from './topbar/topbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserAccountPageComponent } from './user-account-page/user-account-page.component';
import { ArticleCreatePageComponent } from './article-create-page/article-create-page.component';


@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    LoginComponent,
    ModaleInscriptionComponent,
    TopbarComponent,
    DashboardComponent,
    BrowserModule,
    ReactiveFormsModule,
    UserAccountPageComponent,
    ArticleCreatePageComponent,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
