import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { AdminMarketService, PRESET_EVENTS, VOLATILITY_PRESETS } from '../../core/services/admin-market.service';
import { AdminStock } from '../../core/models/models';

@Component({
  selector: 'app-admin-market',
  templateUrl: './admin-market.component.html',
  styleUrls: ['./admin-market.component.css']
})
export class AdminMarketComponent implements OnInit {

  stocks: AdminStock[] = [];
  saving = false;

  // Sentiment
  sentimentValue = 0;
  sentimentLabel = 'Neutral ➡️';

  sentimentPresets = [
    { label: 'Strong Bear', value: -0.8, icon: '🐻' },
    { label: 'Bear',        value: -0.4, icon: '📉' },
    { label: 'Neutral',     value:  0.0, icon: '➡️' },
    { label: 'Bull',        value: +0.4, icon: '📈' },
    { label: 'Strong Bull', value: +0.8, icon: '🐂' },
  ];

  // Events
  eventPresets = PRESET_EVENTS;
  selectedStockId: any = '';
  selectedEvent: typeof PRESET_EVENTS[0] | null = null;
  customImpact = 0;
  customTicks  = 10;

  // Volatility
  volatilityPresets = VOLATILITY_PRESETS;
  volatilityMap: Record<number, number> = {};

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  constructor(
    public adminService: AdminService,
    private marketService: AdminMarketService
  ) {}

  ngOnInit() {
    this.adminService.getStocks().subscribe(
      stocks => this.stocks = stocks,
      err    => console.error('Failed to load stocks', err)
    );
  }

  // ── Sentiment ─────────────────────────────────────────────────
  onSentimentChange() {
    this.sentimentLabel = this.getSentimentLabel(this.sentimentValue);
  }

  applySentiment(value: number) {
    this.sentimentValue = value;
    this.onSentimentChange();
  }

  submitSentiment() {
    this.saving = true;
    this.marketService.setSentiment(this.sentimentValue, this.sentimentLabel).subscribe(
      res  => { this.showToast(res.message || 'Sentiment applied.', 'success'); this.saving = false; },
      err  => { this.showToast(err.error?.message || 'Failed to apply sentiment.', 'error'); this.saving = false; }
    );
  }

  getSentimentLabel(v: number): string {
    if (v >  0.5) return 'Strong Bull 🐂';
    if (v >  0.1) return 'Bullish 📈';
    if (v < -0.5) return 'Strong Bear 🐻';
    if (v < -0.1) return 'Bearish 📉';
    return 'Neutral ➡️';
  }

  getSentimentClass(): string {
    if (this.sentimentValue >  0.1) return 'sentiment-badge badge-bull';
    if (this.sentimentValue < -0.1) return 'sentiment-badge badge-bear';
    return 'sentiment-badge badge-neutral';
  }

  // ── Events ────────────────────────────────────────────────────
  selectEvent(e: typeof PRESET_EVENTS[0]) {
    this.selectedEvent = e;
    this.customImpact  = e.impact;
    this.customTicks   = e.ticks;
  }

  triggerEvent() {
    if (!this.selectedStockId || !this.selectedEvent) return;
    this.saving = true;
    this.marketService.triggerEvent(
      +this.selectedStockId,
      this.selectedEvent.name,
      this.customImpact,
      this.customTicks
    ).subscribe(
      res => {
        this.showToast(res.message || `Event fired on stock ${this.selectedStockId}`, 'success');
        this.saving = false;
        this.selectedEvent   = null;
        this.selectedStockId = '';
      },
      err => { this.showToast(err.error?.message || 'Failed to fire event.', 'error'); this.saving = false; }
    );
  }

  // ── Volatility ────────────────────────────────────────────────
  getVolatility(stockId: number): number {
    return this.volatilityMap[stockId] ?? 1.5;
  }

  setVolatility(stockId: number, value: number) {
    this.marketService.setVolatility(stockId, value).subscribe(
      res => {
        this.volatilityMap[stockId] = value;
        this.showToast(res.message || `Volatility updated.`, 'success');
      },
      err => this.showToast(err.error?.message || 'Failed to set volatility.', 'error')
    );
  }

  // ── Toast ─────────────────────────────────────────────────────
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType    = type;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage = '', 4000);
  }
}
