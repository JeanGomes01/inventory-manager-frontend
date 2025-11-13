import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MovementsService } from '../../../services/movements.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  isOpen = true;
  movementsCount = 0;

  constructor(
    private movementsService: MovementsService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.notifications.count$.subscribe((count) => {
      this.movementsCount = count;
    });

    this.movementsService.getMovements().subscribe((movements) => {
      this.notifications.setCount(movements.length);
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  get screenSmall() {
    return window.innerWidth < 768;
  }
}
