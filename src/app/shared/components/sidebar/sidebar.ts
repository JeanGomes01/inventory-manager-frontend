import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MovementsService } from '../../../services/movements.service';
import { NotificationsService } from '../../../services/notifications.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  isOpen = true;
  movementsCount = 0;
  hasProducts = false;

  constructor(
    private movementsService: MovementsService,
    private notifications: NotificationsService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.productsService.hasProducts$.subscribe((has) => {
      this.hasProducts = has;
    });

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
