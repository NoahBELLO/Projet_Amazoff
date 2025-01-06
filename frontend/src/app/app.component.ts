import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importer HttpClientModule
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component'


//Le module HttpClientModule permet 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet,RouterLink, CommonModule, HttpClientModule,ModaleInscriptionComponent] 
})
export class AppComponent {
  title = 'AmazOff';
}
