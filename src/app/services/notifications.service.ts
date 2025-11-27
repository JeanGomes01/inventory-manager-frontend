import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  count = signal(0);

  setCount(count: number) {
    this.count.set(count);
  }

  increment() {
    this.count.update((count) => count + 1);
  }

  clear() {
    this.count.set(0);
  }
}
