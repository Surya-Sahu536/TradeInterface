import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { Stock, PricePoint } from '../../core/models/models';
import { StockService } from '../../core/services/stock.service';
import { AuthService } from '../../core/services/auth.service';
import { PriceSignalRService } from '../../core/services/price-signalr.service';

Chart.register(...registerables);

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  stock!: Stock;
  priceHistory: PricePoint[] = [];
  chart!: Chart;
  quantity = 1;
  tradeType: 'BUY' | 'SELL' = 'BUY';
  loading = false;

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any;
  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    public auth: AuthService,
    private signalR: PriceSignalRService,
    private snack: MatSnackBar
  ) {}

  // ── Availability % for the progress bar ──────────────────────
  get availabilityPercent(): number {
    if (!this.stock || this.stock.totalShares === 0) return 0;
    return Math.round((this.stock.availableShares / this.stock.totalShares) * 100);
  }

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    if (!id || isNaN(id)) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.stockService.getStockById(id).subscribe(
      data => {
        this.stock = data.stock;
        this.priceHistory = data.priceHistory;
        if (this.chart) this.updateChart();
      },
      err => console.error('Failed to load stock', err)
    );

    this.sub = this.signalR.priceUpdate$.subscribe(update => {
      if (this.stock && update.stockId === this.stock.id) {
        this.stock.currentPrice  = update.price;
        this.stock.changePercent = update.changePercent;
        // Update available shares if included in SignalR update
        if (update.availableShares !== undefined) {
          this.stock.availableShares = update.availableShares;
        }
        this.addPriceToChart(update.price);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initChart(), 100);
  }

  initChart() {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.priceHistory.map(p => new Date(p.timestamp).toLocaleTimeString()),
        datasets: [{
          label: 'Price', data: this.priceHistory.map(p => p.price),
          borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.08)',
          borderWidth: 2, pointRadius: 0, fill: true, tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            ticks: { color: '#6b7a99', callback: v => '₹' + Number(v).toFixed(2) },
            grid: { color: '#1e2d4a' }
          }
        },
        animation: { duration: 0 }
      }
    });
  }

  addPriceToChart(price: number) {
    if (!this.chart) return;
    this.chart.data.labels?.push(new Date().toLocaleTimeString());
    this.chart.data.datasets[0].data.push(price);
    if ((this.chart.data.labels?.length ?? 0) > 100) {
      this.chart.data.labels?.shift();
      this.chart.data.datasets[0].data.shift();
    }
    this.chart.update('none');
  }

  updateChart() {
    if (!this.chart) return;
    this.chart.data.labels = this.priceHistory.map(p => new Date(p.timestamp).toLocaleTimeString());
    this.chart.data.datasets[0].data = this.priceHistory.map(p => p.price);
    this.chart.update();
  }

  showToast(message: string, type: 'error' | 'success') {
    this.toastMessage = message;
    this.toastType = type;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage = '', 4000);
  }

  executeTrade() {
    if (this.tradeType === 'BUY' && this.stock.availableShares === 0) return;

    this.loading = true;
    this.toastMessage = '';

    const action = this.tradeType === 'BUY'
      ? this.stockService.buy(this.stock.id, this.quantity)
      : this.stockService.sell(this.stock.id, this.quantity);

    action.subscribe(
      (res: any) => {
        this.auth.updateBalance(res.newBalance);
        // Update available shares live from API response
        if (res.availableShares !== undefined) {
          this.stock.availableShares = res.availableShares;
        }
        this.showToast(res.message, 'success');
        this.loading = false;
      },
      err => {
        this.showToast(err.error?.message || 'Trade failed. Please try again.', 'error');
        this.loading = false;
      }
    );
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
