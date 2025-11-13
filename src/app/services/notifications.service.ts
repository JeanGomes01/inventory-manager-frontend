import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private movementsCount = new BehaviorSubject<number>(0);
  count$ = this.movementsCount.asObservable();

  setCount(count: number) {
    this.movementsCount.next(count);
  }

  increment() {
    this.movementsCount.next(this.movementsCount.value + 1);
  }

  clear() {
    this.movementsCount.next(0);
  }
}
