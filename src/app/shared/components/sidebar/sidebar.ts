import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  isOpen = true;

  constructor() {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  get screenSmall() {
    return window.innerWidth < 768;
  }
}
