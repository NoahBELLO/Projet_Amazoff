import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commande-bloc',
  imports: [NgFor, NgIf],
  templateUrl: './commande-bloc.component.html',
  styleUrl: './commande-bloc.component.css'
})
export class CommandeBlocComponent {
  @Input() commande: any;
  @Input() isDelivered: boolean = false;
}
