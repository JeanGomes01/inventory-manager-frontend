import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Modal } from '../../shared/modal/modal';
import { IProduct } from '../../types/product.interface';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  productForm!: FormGroup;

  products: IProduct[] = [];
  allProducts: IProduct[] = [];

  editingProductId: number | null = null;
  highlightedProductId: number | null = null;
  searchTerm = '';

  isModalOpen = false;

  totalProducts = 0;
  totalQuantity = 0;
  totalValue = 0;

  constructor(private productsService: ProductsService, private fb: FormBuilder) {
    effect(() => {
      const products = this.productsService.products();

      this.totalProducts = products.length;
      this.totalQuantity = products.reduce((t, p) => t + p.quantity, 0);
      this.totalValue = products.reduce((t, p) => t + p.price * p.quantity, 0);

      this.allProducts = [...products];
      this.products = [...products];
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0],
    });
  }

  createProduct() {
    if (this.productForm.invalid) return;

    const newProduct = {
      ...this.productForm.value,
      quantity: Number(this.productForm.value.quantity) || 0,
      price: Number(this.productForm.value.price) || 0,
    };

    this.productsService.createProduct(newProduct).subscribe({
      next: (created) => {
        this.highlightedProductId = created.id;
        setTimeout(() => {
          this.highlightedProductId = null;
        }, 1000);

        this.productForm.reset({ quantity: 0, price: 0 });
        this.closeModal();
      },
      error: (err) => console.error('Erro ao criar produto', err),
    });
  }

  updateProduct(product: IProduct) {
    this.editingProductId = product.id;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    });
  }

  saveProduct() {
    if (!this.editingProductId || this.productForm.invalid) return;

    const updatedData = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      quantity: Number(this.productForm.value.quantity),
    };

    this.productsService.createProduct(updatedData).subscribe((updated) => {
      this.productsService.updateLocalProduct(updated);
      this.editingProductId = null;
      this.productForm.reset();
    });
  }

  cancelEdit() {
    this.editingProductId = null;
    this.productForm.reset({
      name: '',
      description: '',
      quantity: 0,
      price: 0,
    });
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err),
    });
  }

  loadProducts() {
    this.productsService.loadProducts();
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

    input.value = numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = query;

    if (!query) {
      this.products = [...this.allProducts];
      this.calculateTotals();
      return;
    }

    this.products = this.allProducts.filter((product) => {
      const name = product.name.toLowerCase().includes(query) || false;
      const description = product.description?.toLowerCase().includes(query) || false;
      const category = product.category?.toLowerCase().includes(query) || false;

      return name || description || category;
    });

    this.calculateTotals();
  }
}
