import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MarketStatus {
  sentiment: string;
  sentimentValue: number;
}

export const PRESET_EVENTS = [
  { name: 'Earnings Beat',      impact: +15, ticks: 15, icon: '🚀', color: 'green' },
  { name: 'Earnings Miss',      impact: -12, ticks: 15, icon: '📉', color: 'red'   },
  { name: 'CEO Resigned',       impact: -18, ticks: 20, icon: '😱', color: 'red'   },
  { name: 'Acquisition News',   impact: +20, ticks: 12, icon: '🤝', color: 'green' },
  { name: 'Fraud Scandal',      impact: -25, ticks: 25, icon: '🚨', color: 'red'   },
  { name: 'New Product Launch', impact: +10, ticks: 10, icon: '🎉', color: 'green' },
  { name: 'Regulatory Fine',    impact: -10, ticks: 12, icon: '⚖️',  color: 'red'   },
  { name: 'Buyback Announced',  impact:  +8, ticks: 10, icon: '💰', color: 'green' },
];

export const VOLATILITY_PRESETS = [
  { label: 'Very Low',  value: 0.3 },
  { label: 'Low',       value: 0.7 },
  { label: 'Medium',    value: 1.5 },
  { label: 'High',      value: 3.0 },
  { label: 'Extreme',   value: 6.0 },
];

@Injectable({ providedIn: 'root' })
export class AdminMarketService {
  private readonly API = 'http://localhost:5001/api/admin/market';

  constructor(private http: HttpClient) {}

  setSentiment(value: number, label: string) {
    return this.http.post<any>(`${this.API}/sentiment`, { value, label });
  }

  triggerEvent(stockId: number, eventName: string, impactPercent: number, durationTicks: number) {
    return this.http.post<any>(`${this.API}/event`, { stockId, eventName, impactPercent, durationTicks });
  }

  setVolatility(stockId: number, value: number) {
    return this.http.post<any>(`${this.API}/volatility`, { stockId, value });
  }
}
