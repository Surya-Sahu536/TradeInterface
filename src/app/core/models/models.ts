export interface User {
  fullName: string;
  email: string;
  walletBalance: number;
  token: string;
}

export interface Stock {
  id: number;
  symbol: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  previousClose: number;
  volume: number;
  totalShares: number;       // total shares issued
  availableShares: number;   // live — decreases on buy, increases on sell
  changePercent: number;
  lastUpdated: string;
}

export interface PricePoint {
  price: number;
  timestamp: string;
}

export interface StockDetail {
  stock: Stock;
  priceHistory: PricePoint[];
}

export interface Holding {
  stockId: number;
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface Portfolio {
  walletBalance: number;
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  holdings: Holding[];
}

export interface Transaction {
  id: number;
  symbol: string;
  companyName: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  createdAt: string;
}

export interface AdminStock {
  id: number;
  symbol: string;
  companyName: string;
  sector: string;
  initialPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
}
