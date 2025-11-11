import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovementsService } from '../../services/movements.service';
import { IMovement } from '../../types/movement.interface';

@Component({
  selector: 'app-movements',
  imports: [CommonModule],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class Movements {
  movements: IMovement[] = [];

  constructor(private movementsService: MovementsService) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements() {
    this.movementsService.getMovements().subscribe((data) => {
      this.movements = data;
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}
