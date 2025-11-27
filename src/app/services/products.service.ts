import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { IProduct } from '../types/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = 'http://localhost:3000/products';

  private productsSignal = signal<IProduct[]>([]);

  products = this.productsSignal.asReadonly();

  hasProducts = signal(false);
  loading = signal(false);
  error = signal(false);

  constructor(private http: HttpClient) {}

  loadProducts() {
    this.http.get<IProduct[]>(this.apiUrl).subscribe((data) => {
      this.productsSignal.set(data);
      this.hasProducts.set(data.length > 0);
    });
  }

  updateLocalProduct(updated: IProduct) {
    this.productsSignal.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }

  addProduct(product: IProduct) {
    this.productsSignal.update((list) => [...list, product]);
  }

  createProduct(product: Partial<IProduct>) {
    return this.http.post<IProduct>(this.apiUrl, product).pipe(
      tap((created) => {
        this.productsSignal.update((list) => [...list, created]);
        this.hasProducts.set(true);
      })
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(tap(() => this.loadProducts()));
  }

  deleteAllProducts() {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => {
        this.productsSignal.set([]);
        this.hasProducts.set(false);
      })
    );
  }
}
