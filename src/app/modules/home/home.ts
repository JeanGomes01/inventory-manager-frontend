import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, effect } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MovementsService } from '../../services/movements.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  doughnutChart!: Chart;
  lowStockBarChart!: Chart;

  loadingChart = true;
  loadingLowStock = true;

  totalProducts = 0;
  lowStockCount = 0;
  recentMovementsCount = 0;
  recentMovements: any[] = [];

  lowStockProducts: any[] = [];

  loading = true;
  errorLoading = false;

  productsEmpty = false;
  movementsEmpty = false;

  constructor(public productsService: ProductsService, public movementsService: MovementsService) {}

  get movements() {
    return this.movementsService.movements();
  }

  get loadingMovements() {
    return this.movementsService.loading();
  }
  get errorMovements() {
    return this.movementsService.error();
  }

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.movementsService.loadMovements();

    effect(() => {
      const products = this.productsService.products();
      const movements = this.movementsService.movements();

      const normalizedProducts = products.map((p: any) => ({
        ...p,
        category: p.category?.name || p.category || '-',
      }));

      this.totalProducts = normalizedProducts.length;
      this.productsEmpty = normalizedProducts.length === 0;

      this.lowStockProducts = normalizedProducts
        .filter((p: any) => p.quantity < 5)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          category: p.category,
        }));

      this.lowStockCount = this.lowStockProducts.length;
      this.updateLowStockChart();

      this.recentMovements = movements.slice(0, 5);
      this.recentMovementsCount = movements.length;
      this.movementsEmpty = movements.length === 0;

      this.updateDoughnutChart(movements);

      this.loading = false;
    });
  }

  ngAfterViewInit(): void {
    this.buildCharts();
  }

  ngOnDestroy(): void {
    this.doughnutChart?.destroy();
    this.lowStockBarChart?.destroy();
  }

  updateDoughnutChart(movements: any[]) {
    if (!this.doughnutChart) return;

    const entriesMovements = movements
      .filter((m) => m.type === 'entrada')
      .reduce((sum, m) => sum + m.quantity, 0);

    const exitsMovements = movements
      .filter((m) => m.type === 'saida')
      .reduce((sum, m) => sum + m.quantity, 0);

    this.doughnutChart.data.datasets[0].data = [entriesMovements, exitsMovements];
    this.doughnutChart.update();
  }

  buildCharts() {
    this.doughnutChart = new Chart('inputAndOutputChart', {
      type: 'doughnut',
      data: {
        labels: ['Entradas', 'Saídas'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ['#22c55e', '#ef4444'],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    });

    this.lowStockBarChart = new Chart('lowStockChart', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Quantidade',
            data: [],
            backgroundColor: '#fbbf24',
            borderColor: '#d97706',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }

  updateLowStockChart() {
    if (!this.lowStockBarChart) return;

    this.lowStockBarChart.data.labels = this.lowStockProducts.map((p) => p.name);
    this.lowStockBarChart.data.datasets[0].data = this.lowStockProducts.map((p) => p.quantity);

    this.lowStockBarChart.update();
  }

  onAddItem() {
    console.log('Adicionar item');
  }
}
