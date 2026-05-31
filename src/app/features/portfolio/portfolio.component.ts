import { Component, OnInit } from '@angular/core';
import { Portfolio, Transaction } from '../../core/models/models';
import { StockService } from '../../core/services/stock.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio: Portfolio | null = null;
  transactions: Transaction[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stockService.getPortfolio().subscribe(
      p => this.portfolio = p,
      err => console.error('Failed to load portfolio', err)
    );
    this.stockService.getTransactions().subscribe(
      tx => this.transactions = tx,
      err => console.error('Failed to load transactions', err)
    );
  }
}
