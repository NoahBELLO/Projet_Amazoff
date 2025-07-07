import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importer HttpClientModule
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopbarComponent } from './topbar/topbar.component';



//Le module HttpClientModule permet 
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, CommonModule, HttpClientModule] 
})

export class AppComponent {
  title = 'AmazOff';
}
