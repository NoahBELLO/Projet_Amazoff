import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})

export class TopbarComponent {

}
