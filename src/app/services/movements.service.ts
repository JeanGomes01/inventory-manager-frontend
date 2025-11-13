import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IMovement } from '../types/movement.interface';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  apiUrl = 'http://localhost:3000/movements';

  constructor(private http: HttpClient, private notifications: NotificationsService) {}

  getMovements(): Observable<IMovement[]> {
    return this.http.get<IMovement[]>(this.apiUrl);
  }
  createMovement(movement: Partial<IMovement>): Observable<IMovement> {
    return this.http.post<IMovement>(this.apiUrl, movement).pipe(
      tap(() => {
        this.notifications.increment();
      })
    );
  }

  deleteMovement(id: number): Observable<IMovement> {
    return this.http.delete<IMovement>(`${this.apiUrl}/${id}`);
  }

  deleteAllMovements(): Observable<IMovement[]> {
    return this.http.delete<IMovement[]>(this.apiUrl);
  }
}
