import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ModaleInscriptionComponent } from './modale-inscription/modale-inscription.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ModaleInscriptionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
