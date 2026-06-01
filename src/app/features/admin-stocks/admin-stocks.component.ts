import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminStock } from '../../core/models/models';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-stocks',
  templateUrl: './admin-stocks.component.html',
  styleUrls: ['./admin-stocks.component.css']
})
export class AdminStocksComponent implements OnInit {

  stocks: AdminStock[] = [];
  showForm = false;
  saving = false;
  editingStock: AdminStock | null = null;

  sectors = [
    'IT', 'Banking', 'Energy', 'Automotive',
    'Pharma', 'FMCG', 'Telecom', 'Infrastructure',
    'Finance', 'Healthcare', 'Retail'
  ];

  newStock = {
    symbol: '',
    companyName: '',
    sector: '',
    initialPrice: 0,
    totalShares: 1000000
  };

  editForm = {
    companyName: '',
    sector: '',
    currentPrice: 0,
    isActive: true
  };

  constructor(
    public adminService: AdminService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.adminService.getStocks().subscribe(
      stocks => this.stocks = stocks,
      err    => console.error('Failed to load stocks', err)
    );
  }

  // ── Available shares colour class ─────────────────────────────
  getAvailClass(stock: AdminStock): string {
    if (!stock.totalShares || stock.availableShares === 0) return 'avail-soldout';
    const pct = (stock.availableShares / stock.totalShares) * 100;
    if (pct < 20) return 'avail-low';
      return 'avail-ok';
  }

  // ── Create ────────────────────────────────────────────────────
  createStock() {
    if (!this.newStock.symbol || !this.newStock.companyName ||
        !this.newStock.sector  || !this.newStock.initialPrice) {
      this.snack.open('All fields are required.', 'Close', { duration: 2500 });
      return;
    }

    this.saving = true;
    this.adminService.createStock(this.newStock).subscribe(
      () => {
        this.snack.open('Stock added successfully!', 'Close', { duration: 2500 });
        this.newStock = { symbol: '', companyName: '', sector: '', initialPrice: 0, totalShares: 1000000 };
        this.showForm = false;
        this.saving   = false;
        this.loadStocks();
      },
      err => {
        this.snack.open(err.error?.message || 'Failed to add stock.', 'Close', { duration: 3000 });
        this.saving = false;
      }
    );
  }

  // ── Edit ──────────────────────────────────────────────────────
  startEdit(stock: AdminStock) {
    this.editingStock = stock;
    this.editForm = {
      companyName:  stock.companyName,
      sector:       stock.sector,
      currentPrice: stock.currentPrice,
      isActive:     stock.isActive
    };
  }

  updateStock() {
    if (!this.editingStock) return;
    this.saving = true;

    this.adminService.updateStock(this.editingStock.id, this.editForm).subscribe(
      () => {
        this.snack.open('Stock updated!', 'Close', { duration: 2500 });
        this.editingStock = null;
        this.saving       = false;
        this.loadStocks();
      },
      () => {
        this.snack.open('Update failed.', 'Close', { duration: 3000 });
        this.saving = false;
      }
    );
  }

  // ── Deactivate ────────────────────────────────────────────────
  deleteStock(stock: AdminStock) {
    if (!confirm(`Deactivate ${stock.symbol}? Users will no longer see it.`)) return;

    this.adminService.deleteStock(stock.id).subscribe(
      () => {
        this.snack.open('Stock deactivated.', 'Close', { duration: 2500 });
        this.loadStocks();
      },
      () => this.snack.open('Failed to deactivate.', 'Close', { duration: 3000 })
    );
  }

  issueShares(stock: AdminStock) {
    const input = prompt(
      `Issue additional shares for ${stock.symbol}\n` +
      `Current: ${stock.availableShares.toLocaleString()} available of ${stock.totalShares.toLocaleString()} total\n\n` +
      `How many new shares to issue?`
    );
    if (!input || isNaN(+input) || +input <= 0) return;

    this.adminService.issueShares(stock.id, +input).subscribe(
      res => {
        this.snack.open(res.message, 'Close', { duration: 3000 });
        this.loadStocks();
      },
      err => this.snack.open(err.error?.message || 'Failed to issue shares.', 'Close', { duration: 3000 })
    );
  }
}