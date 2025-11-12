import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../types/product.interface';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: IProduct[] = [];

  totalProducts = 0;
  totalQuantity = 0;
  totalValue = 0;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();

    this.productsService.getProducts().subscribe((data) => {
      this.products = data;
      this.calculateTotals();
    });
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (res) => (this.products = res),
      error: (err) => console.error(err),
    });
  }

  calculateTotals() {
    this.totalProducts = this.products.length;
    this.totalQuantity = this.products.reduce((total, product) => total + product.quantity, 0);
    this.totalValue = this.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  isLowStock(product: IProduct): boolean {
    return product.quantity < 5;
  }
}
