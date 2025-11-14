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
    this.productsService.getProducts().subscribe((products) => {
      this.totalProducts = products.length;
      this.lowStockProducts = products.filter((p: any) => p.quantity < 5);
      this.lowStockCount = this.lowStockProducts.length;

      this.updateLowStockChart();
    });

    this.movementsService.getMovements().subscribe((movements) => {
      this.recentMovements = movements.slice(0, 5);
      this.recentMovementsCount = movements.length;

      this.updateDoughnutChart(movements);
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
            data: [350, 120],
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
