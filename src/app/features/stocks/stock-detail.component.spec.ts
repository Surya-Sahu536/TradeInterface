import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'jasmine';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { StockDetailComponent } from './stock-detail.component';
import { StockService } from '../../core/services/stock.service';
import { AuthService } from '../../core/services/auth.service';
import { PriceSignalRService } from '../../core/services/price-signalr.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

const mockStockDetail = {
  stock: {
    id: 1, symbol: 'TCS', companyName: 'Tata Consultancy Services', sector: 'IT',
    currentPrice: 3920, openPrice: 3900, dayHigh: 3950, dayLow: 3880,
    previousClose: 3905, volume: 850000, changePercent: 0.51,
    lastUpdated: new Date().toISOString()
  },
  priceHistory: [
    { price: 3900, timestamp: new Date().toISOString() },
    { price: 3920, timestamp: new Date().toISOString() }
  ]
};

describe('StockDetailComponent', () => {
  let component: StockDetailComponent;
  let fixture: ComponentFixture<StockDetailComponent>;
  const priceUpdate$ = new Subject<any>();

  const mockStockService = {
    getStockById: jasmine.createSpy('getStockById').and.returnValue(of(mockStockDetail)),
    buy: jasmine.createSpy('buy').and.returnValue(of({ message: 'Bought', newBalance: 9000 })),
    sell: jasmine.createSpy('sell').and.returnValue(of({ message: 'Sold', newBalance: 11000 }))
  };
  const mockAuth = {
    currentUser: { fullName: 'Test User', walletBalance: 10000 },
    updateBalance: jasmine.createSpy('updateBalance'),
    logout: jasmine.createSpy('logout')
  };
  const mockSignalR = { priceUpdate$: priceUpdate$.asObservable() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockDetailComponent, NavbarComponent],
      imports: [RouterTestingModule, FormsModule, MatSnackBarModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        { provide: StockService, useValue: mockStockService },
        { provide: AuthService, useValue: mockAuth },
        { provide: PriceSignalRService, useValue: mockSignalR }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stock on init', () => {
    expect(mockStockService.getStockById).toHaveBeenCalledWith(1);
    expect(component.stock.symbol).toBe('TCS');
  });

  it('should default trade type to BUY', () => {
    expect(component.tradeType).toBe('BUY');
  });

  it('should call stockService.buy when trade type is BUY', () => {
    component.quantity = 5;
    component.tradeType = 'BUY';
    component.executeTrade();
    expect(mockStockService.buy).toHaveBeenCalledWith(1, 5);
  });

  it('should call stockService.sell when trade type is SELL', () => {
    component.quantity = 2;
    component.tradeType = 'SELL';
    component.executeTrade();
    expect(mockStockService.sell).toHaveBeenCalledWith(1, 2);
  });

  it('should update balance after successful trade', () => {
    component.quantity = 1;
    component.tradeType = 'BUY';
    component.executeTrade();
    expect(mockAuth.updateBalance).toHaveBeenCalledWith(9000);
  });

  it('should update stock price on SignalR event', () => {
    priceUpdate$.next({ stockId: 1, price: 4000, changePercent: 2.56 });
    expect(component.stock.currentPrice).toBe(4000);
  });

  it('should reset loading on trade error', () => {
    mockStockService.buy.and.returnValue(throwError({ error: { message: 'Insufficient balance' } }));
    component.quantity = 1000;
    component.tradeType = 'BUY';
    component.executeTrade();
    expect(component.loading).toBeFalse();
  });
});
