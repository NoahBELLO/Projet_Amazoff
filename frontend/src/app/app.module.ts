import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule,ModaleInscriptionComponent],

})
export class AppModule {}
