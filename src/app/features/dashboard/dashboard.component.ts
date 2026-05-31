import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stock } from '../../core/models/models';
import { StockService } from '../../core/services/stock.service';
import { AuthService } from '../../core/services/auth.service';
import { PriceSignalRService } from '../../core/services/price-signalr.service';

type SortField = 'symbol' | 'companyName' | 'currentPrice' | 'changePercent' | 'dayHigh' | 'dayLow' | 'volume';
type SortDir   = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Raw data
  stocks: Stock[] = [];
  flashMap: Record<number, 'up' | 'down' | null> = {};

  // Filter state
  searchTerm     = '';
  selectedSector = '';
  selectedMovement = '';

  // Sort state
  sortField: SortField = 'symbol';
  sortDir: SortDir     = 'asc';

  // Pagination state
  currentPage = 1;
  pageSize: any = 10;

  // Derived
  filteredStocks: Stock[] = [];
  pagedStocks:    Stock[] = [];
  sectors:        string[] = [];

  private sub!: Subscription;

  constructor(
    public auth: AuthService,
    private stockService: StockService,
    private signalR: PriceSignalRService
  ) {}

  // ─── Computed getters ────────────────────────────────────────────────────

  get gainers(): number { return this.filteredStocks.filter(s => s.changePercent >= 0).length; }
  get losers():  number { return this.filteredStocks.filter(s => s.changePercent < 0).length; }

  get topTraded(): Stock[] {
    return [...this.stocks].sort((a, b) => b.volume - a.volume).slice(0, 3);
  }

  get topGainers(): Stock[] {
    return [...this.stocks].filter(s => s.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  }

  get topLosers(): Stock[] {
    return [...this.stocks].filter(s => s.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredStocks.length / +this.pageSize));
  }

  get pageStart(): number {
    return this.filteredStocks.length === 0 ? 0 : (this.currentPage - 1) * +this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * +this.pageSize, this.filteredStocks.length);
  }

  get pageNumbers(): number[] {
    const total   = this.totalPages;
    const current = this.currentPage;
    const delta   = 2;
    const pages: number[] = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  }

  get isFiltered(): boolean {
    return !!this.searchTerm || !!this.selectedSector || !!this.selectedMovement;
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  ngOnInit() {
    this.stockService.getStocks().subscribe(
      stocks => {
        this.stocks = stocks;
        this.buildSectors();
        this.applyAll();
      },
      err => console.error('Failed to load stocks', err)
    );

    this.sub = this.signalR.priceUpdate$.subscribe(update => {
      const stock = this.stocks.find(s => s.id === update.stockId);
      if (!stock) return;

      const direction = update.price > stock.currentPrice ? 'up' : 'down';
      stock.currentPrice   = update.price;
      stock.changePercent  = update.changePercent;
      this.flashMap[stock.id] = direction;
      setTimeout(() => this.flashMap[stock.id] = null, 600);

      // Re-apply sort/filter so live values stay consistent
      this.applyAll();
    });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  // ─── Filter ──────────────────────────────────────────────────────────────

  onFilterChange() {
    this.currentPage = 1;   // reset to page 1 on any filter change
    this.applyAll();
  }

  clearSearch() {
    this.searchTerm = '';
    this.onFilterChange();
  }

  resetFilters() {
    this.searchTerm       = '';
    this.selectedSector   = '';
    this.selectedMovement = '';
    this.onFilterChange();
  }

  // ─── Sort ────────────────────────────────────────────────────────────────

  sortBy(field: SortField) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir   = 'asc';
    }
    this.applyAll();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '⇅';
    return this.sortDir === 'asc' ? '↑' : '↓';
  }

  // ─── Pagination ──────────────────────────────────────────────────────────

  goToPage(page: number) {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.applyPage();
  }

  nextPage() { this.goToPage(this.currentPage + 1); }
  prevPage() { this.goToPage(this.currentPage - 1); }

  onPageSizeChange() {
    this.pageSize = +this.pageSize;  // coerce to number in case Angular passes a string
    this.currentPage = 1;
    this.applyAll();
  }

  // ─── Core pipeline ───────────────────────────────────────────────────────

  private applyAll() {
    this.applyFilter();
    this.applySort();
    this.applyPage();
  }

  private applyFilter() {
    let result = [...this.stocks];

    // Search: match symbol or company name
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        s.symbol.toLowerCase().includes(term) ||
        s.companyName.toLowerCase().includes(term)
      );
    }

    // Sector filter
    if (this.selectedSector) {
      result = result.filter(s => s.sector === this.selectedSector);
    }

    // Movement filter
    if (this.selectedMovement === 'gainers') {
      result = result.filter(s => s.changePercent >= 0);
    } else if (this.selectedMovement === 'losers') {
      result = result.filter(s => s.changePercent < 0);
    }

    this.filteredStocks = result;
  }

  private applySort() {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    const field = this.sortField;

    this.filteredStocks = [...this.filteredStocks].sort((a, b) => {
      const av = a[field];
      const bv = b[field];

      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dir;
      }
      return ((av as number) - (bv as number)) * dir;
    });
  }

  private applyPage() {
    const size  = +this.pageSize;
    const start = (this.currentPage - 1) * size;
    this.pagedStocks = this.filteredStocks.slice(start, start + size);
  }

  private buildSectors() {
    this.sectors = [...new Set(this.stocks.map(s => s.sector))].sort();
  }
}
