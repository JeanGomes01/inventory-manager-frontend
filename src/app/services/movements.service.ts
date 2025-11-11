import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMovement } from '../types/movement.interface';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  apiUrl = 'http://localhost:3000/movements';

  constructor(private http: HttpClient) {}

  getMovements(): Observable<IMovement[]> {
    return this.http.get<IMovement[]>(this.apiUrl);
  }
}
