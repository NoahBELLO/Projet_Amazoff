import { NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [NgFor],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @Input() sections: any[] = [];
  @Input() activeSection: string = '';
  @Output() setActiveSection = new EventEmitter<string>();

  constructor(private router: Router) { }

  selectSection(key: string) {
    this.setActiveSection.emit(key);
    this.activeSection = key;
  }
}
