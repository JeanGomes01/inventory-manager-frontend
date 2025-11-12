import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../types/product.interface';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: IProduct[] = [];
  productForm!: FormGroup;

  totalProducts = 0;
  totalQuantity = 0;
  totalValue = 0;

  constructor(private productsService: ProductsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();

    setTimeout(() => this.updatePriceDisplay(0));

    this.productsService.getProducts().subscribe((data) => {
      this.products = data;
      this.calculateTotals();
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  createProduct() {
    if (this.productForm.invalid) return;

    const newProduct = this.productForm.value;

    this.productsService.createProduct(newProduct).subscribe({
      next: (created) => {
        this.products.push(created);
        this.calculateTotals();
        this.productForm.reset({ quantity: 0, price: 0 });
      },
      error: (err) => console.error('Erro ao criar produto', err),
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

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err),
    });
  }

  updatePriceDisplay(value: number) {
    const formatted = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    const input = document.querySelector<HTMLInputElement>('input[formControlName="price"]');
    if (input) input.value = formatted;
  }

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    if (!value) {
      this.productForm.patchValue({ price: 0 }, { emitEvent: false });
      input.value = '';
      return;
    }

    const numericValue = Number(value) / 100;

    this.productForm.patchValue({ price: numericValue }, { emitEvent: false });

    const formatted = numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    input.value = formatted;
  }
}
