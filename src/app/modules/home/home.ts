import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MovementsService } from '../../services/movements.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  doughnutChart!: Chart;
  lowStockBarChart!: Chart;

  totalProducts = 0;
  lowStockCount = 0;
  recentMovementsCount = 0;

  recentMovements: any[] = [];
  lowStockProducts: any[] = [];

  loading = true;
  errorLoading = false;

  loadingMovements = true;
  loadingLowStock = true;

  loadingChart = true;

  productsEmpty = false;
  movementsEmpty = false;

  constructor(
    private productsService: ProductsService,
    private movementsService: MovementsService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    this.buildCharts();
  }

  ngOnDestroy(): void {
    this.doughnutChart?.destroy();
    this.lowStockBarChart?.destroy();
  }

  loadDashboard() {
    this.errorLoading = false;

    this.movementsService.getMovements().subscribe({
      next: (movements) => {
        this.recentMovements = movements.slice(0, 5);
        this.recentMovementsCount = movements.length;

        this.movementsEmpty = movements.length === 0;

        this.updateDoughnutChart(movements);

        this.loadingMovements = false;
        this.loadingChart = false;
      },
      error: () => {
        this.errorLoading = true;
        this.loadingMovements = false;
        this.loadingChart = false;
      },
    });

    this.productsService.getProducts().subscribe({
      next: (products) => {
        console.log('📥 Produtos recebidos:', products);

        // ✅ Normaliza categoria para string
        const normalizedProducts = products.map((p: any) => ({
          ...p,
          category: p.category?.name || p.category || '-',
        }));

        this.totalProducts = normalizedProducts.length;
        this.productsEmpty = normalizedProducts.length === 0;

        // ✅ Estoque baixo
        this.lowStockProducts = normalizedProducts
          .filter((p: any) => p.quantity < 5)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            quantity: p.quantity,
            category: p.category,
          }));

        this.lowStockCount = this.lowStockProducts.length;

        // ✅ Contagem por categoria (agora funciona)
        const categoryCount: any = {};

        normalizedProducts.forEach((product: any) => {
          if (!categoryCount[product.category]) {
            categoryCount[product.category] = 0;
          }
          categoryCount[product.category]++;
        });

        console.log('📦 Contagem por categoria:', categoryCount);

        this.updateLowStockChart();
        this.loadingLowStock = false;
      },
      error: () => {
        this.errorLoading = true;
        this.loadingLowStock = false;
      },
    });
  }

  updateDoughnutChart(movements: any[]) {
    if (!this.doughnutChart) return;

    const entriesMovements = movements
      .filter((movement) => movement.type === 'entrada')
      .reduce((sum, movement) => sum + movement.quantity, 0);

    const exitsMovements = movements
      .filter((movement) => movement.type === 'saida')
      .reduce((sum, movement) => sum + movement.quantity, 0);

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
      options: { responsive: true, plugins: { legend: { display: false } } },
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
