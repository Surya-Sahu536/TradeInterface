import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stock, StockDetail, Portfolio, Transaction } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly API = 'https://localhost:44328/api';

  constructor(private http: HttpClient) {}

  getStocks() {
    console.log('Fetching stocks from API:', `${this.API}/stocks`);
    return this.http.get<Stock[]>(`${this.API}/stocks`);
  }

  getStockById(id: number) {
    console.log('Fetching stock details from API:', `${this.API}/stocks/${id}`);
    return this.http.get<StockDetail>(`${this.API}/stocks/${id}`);
  }

  getPortfolio() {
    console.log('Fetching portfolio from API:........');
    console.log('Fetching portfolio from API:', `${this.API}/portfolio`);
    return this.http.get<Portfolio>(`${this.API}/portfolio`);
  }

  getTransactions() {
    console.log('Fetching transactions from API:', `${this.API}/portfolio/transactions`);
    return this.http.get<Transaction[]>(`${this.API}/portfolio/transactions`);
  }

  buy(stockId: number, quantity: number) {
    console.log('Buying stock from API:', `${this.API}/trade/buy`);
    return this.http.post<{ message: string; newBalance: number }>(
      `${this.API}/trade/buy`, { stockId, quantity }
    );
  }

  sell(stockId: number, quantity: number) {
    console.log('Selling stock from API:', `${this.API}/trade/sell`);
    return this.http.post<{ message: string; newBalance: number }>(
      `${this.API}/trade/sell`, { stockId, quantity }
    );
  }
}
