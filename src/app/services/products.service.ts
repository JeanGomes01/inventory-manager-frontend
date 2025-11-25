import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProduct } from '../types/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = 'http://localhost:3000/products';

  // 🔥 estado em tempo real
  private hasProductsSubject = new BehaviorSubject<boolean>(false);
  hasProducts$ = this.hasProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl).pipe(
      tap((products) => {
        this.updateHasProducts(products.length > 0);
      })
    );
  }

  createProduct(product: Partial<IProduct>): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product).pipe(
      tap(() => {
        this.updateHasProducts(true);
      })
    );
  }

  updateProduct(id: number, product: Partial<IProduct>): Observable<IProduct> {
    return this.http.patch<IProduct>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // força nova checagem
        this.refreshProductsState();
      })
    );
  }

  deleteAllProducts(): Observable<IProduct[]> {
    return this.http.delete<IProduct[]>(this.apiUrl).pipe(
      tap(() => {
        this.updateHasProducts(false);
      })
    );
  }

  private refreshProductsState() {
    this.getProducts().subscribe();
  }

  private updateHasProducts(value: boolean) {
    this.hasProductsSubject.next(value);
  }
}
