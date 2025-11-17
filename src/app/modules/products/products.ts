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

  editingProductId: number | null = null;

  highlightedProductId: number | null = null;

  totalProducts = 0;
  totalQuantity = 0;
  totalValue = 0;

  constructor(private productsService: ProductsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('🧠 ngOnInit disparado!');
    this.initForm();
    this.loadProducts();
    setTimeout(() => this.updatePriceDisplay(0));
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
    console.log('🟢 Enviando criação de produto...');

    if (this.productForm.invalid) return;

    const newProduct = {
      ...this.productForm.value,
      quantity: Number(this.productForm.value.quantity) || 0,
      price: Number(this.productForm.value.price) || 0,
    };

    this.productsService.createProduct(newProduct).subscribe({
      next: (created) => {
        console.log('✅ Produto criado:', created);
        this.products.push(created);

        this.highlightedProductId = created.id;
        setTimeout(() => {
          this.highlightedProductId = null;
        }, 1000);

        this.productForm.reset({ quantity: 0, price: 0 });
      },
      error: (err) => console.error('Erro ao criar produto', err),
    });
  }

  updateProduct(product: IProduct) {
    this.editingProductId = product.id;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
    });

    console.log('✏️ Editando produto:', product);
  }

  saveProduct() {
    if (!this.editingProductId || this.productForm.invalid) return;

    const updatedData = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      quantity: Number(this.productForm.value.quantity),
    };

    this.productsService.updateProduct(this.editingProductId, updatedData).subscribe({
      next: () => {
        console.log('✅ Produto atualizado com sucesso');
        this.loadProducts();
        this.editingProductId = null;
        this.productForm.reset({ quantity: 0, price: 0 });
      },
      error: (err) => console.error('Erro ao atualizar produto', err),
    });
  }

  cancelEdit() {
    this.editingProductId = null;
    this.productForm.reset({
      name: '',
      description: '',
      quantity: null,
      price: null,
    });
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err),
    });
  }

  loadProducts() {
    console.log('📦 Chamando loadProducts...');
    this.productsService.getProducts().subscribe({
      next: (response) => {
        console.log('📥 Produtos recebidos:', response);
        this.products = response;
        this.calculateTotals();
      },
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
