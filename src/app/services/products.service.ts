import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../types/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  createProduct(product: Partial<IProduct>): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<IProduct>): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.apiUrl}/${id}`);
  }

  deleteAllProducts(): Observable<IProduct[]> {
    return this.http.delete<IProduct[]>(this.apiUrl);
  }
}
