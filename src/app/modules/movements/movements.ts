import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovementsService } from '../../services/movements.service';
import { IMovement } from '../../types/movement.interface';

@Component({
  selector: 'app-movements',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class Movements implements OnInit {
  totalProducts = 0;
  totalQuantity = 0;
  totalValue = 0;

  movements: IMovement[] = [];
  movementForm: FormGroup;

  constructor(private movementsService: MovementsService, private fb: FormBuilder) {
    this.movementForm = this.fb.group({
      userId: [1, Validators.required],
      productName: ['', Validators.required],
      type: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadMovements();
  }

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (!value) {
      this.movementForm.patchValue({ price: 0 }, { emitEvent: false });
      input.value = '';
      return;
    }

    const numericValue = Number(value) / 100;

    this.movementForm.patchValue({ price: numericValue }, { emitEvent: false });

    input.value = numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  loadMovements() {
    this.movementsService.getMovements().subscribe((data) => {
      this.movements = data;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.totalProducts = this.movements.length;
    this.totalQuantity = this.movements.reduce((sum, m) => sum + m.quantity, 0);
    this.totalValue = this.movements.reduce((sum, m) => sum + m.quantity * m.price, 0);
  }

  private toNumber(value: any): number {
    if (value == null) return 0;
    const s = String(value).trim();
    const cleaned = s.replace(/[^\d,.-]/g, '');

    if (cleaned.indexOf(',') > -1 && cleaned.indexOf('.') > -1) {
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
    }

    const normalized = cleaned.replace(',', '.');
    return parseFloat(normalized) || 0;
  }

  createMovement() {
    if (this.movementForm.invalid) return;

    const payload = {
      ...this.movementForm.value,
      price: Number(this.movementForm.value.price),
    };

    this.movementsService.createMovement(payload).subscribe({
      next: () => {
        this.movementForm.reset({
          userId: 1,
          quantity: 1,
          price: 0,
        });

        this.loadMovements();
      },
      error: (err) => console.error(err),
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR');
  }

  get priceFormatted(): string {
    const value = this.movementForm.get('price')?.value || 0;

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
