import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { IMovement } from '../types/movement.interface';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  apiUrl = 'http://localhost:3000/movements';

  movements = signal<IMovement[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(private http: HttpClient, private notifications: NotificationsService) {}

  loadMovements() {
    this.loading.set(true);
    this.http.get<IMovement[]>(this.apiUrl).subscribe({
      next: (movementsList) => {
        this.movements.set(movementsList);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  createMovement(movement: Partial<IMovement>) {
    return this.http.post<IMovement>(this.apiUrl, movement).pipe(
      tap(() => {
        this.notifications.increment();
        this.loadMovements();
      })
    );
  }

  deleteAllMovements() {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => {
        this.movements.set([]);
      })
    );
  }
}
