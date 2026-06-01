import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { AdminStocksComponent } from './admin-stocks.component';
import { AdminService } from '../../core/services/admin.service';

const mockStocks = [
  {
    id: 1, symbol: 'TCS', companyName: 'Tata Consultancy Services',
    sector: 'IT', initialPrice: 3900, currentPrice: 3920,
    totalShares: 300000, availableShares: 280000,
    isActive: true, createdAt: new Date().toISOString()
  },
  {
    id: 2, symbol: 'SBIN', companyName: 'State Bank of India',
    sector: 'Banking', initialPrice: 740, currentPrice: 748,
    totalShares: 2000000, availableShares: 0,
    isActive: true, createdAt: new Date().toISOString()
  }
];

describe('AdminStocksComponent', () => {
  let component: AdminStocksComponent;
  let fixture: ComponentFixture<AdminStocksComponent>;

  const mockAdminService = {
    getStocks:    jasmine.createSpy('getStocks').and.returnValue(of(mockStocks)),
    createStock:  jasmine.createSpy('createStock').and.returnValue(of(mockStocks[0])),
    updateStock:  jasmine.createSpy('updateStock').and.returnValue(of(mockStocks[0])),
    deleteStock:  jasmine.createSpy('deleteStock').and.returnValue(of({})),
    logout:       jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStocksComponent],
      imports: [RouterTestingModule, FormsModule, MatSnackBarModule],
      providers: [{ provide: AdminService, useValue: mockAdminService }]
    }).compileComponents();

    fixture   = TestBed.createComponent(AdminStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stocks on init', () => {
    expect(mockAdminService.getStocks).toHaveBeenCalled();
    expect(component.stocks.length).toBe(2);
  });

  it('should return avail-soldout class when availableShares is 0', () => {
    expect(component.getAvailClass(mockStocks[1] as any)).toBe('avail-soldout');
  });

  it('should return avail-ok class when > 20% available', () => {
    expect(component.getAvailClass(mockStocks[0] as any)).toBe('avail-ok');
  });

  it('should populate editForm when startEdit is called', () => {
    component.startEdit(mockStocks[0] as any);
    expect(component.editingStock?.symbol).toBe('TCS');
    expect(component.editForm.companyName).toBe('Tata Consultancy Services');
    expect(component.editForm.currentPrice).toBe(3920);
  });

  it('should call createStock with valid data', () => {
    component.newStock = {
      symbol: 'INFY', companyName: 'Infosys', sector: 'IT',
      initialPrice: 1450, totalShares: 800000
    };
    component.createStock();
    expect(mockAdminService.createStock).toHaveBeenCalled();
  });

  it('should call updateStock when editingStock is set', () => {
    component.editingStock = mockStocks[0] as any;
    component.editForm = { companyName: 'Updated', sector: 'IT', currentPrice: 4000, isActive: true };
    component.updateStock();
    expect(mockAdminService.updateStock).toHaveBeenCalledWith(1, component.editForm);
  });

  it('should reset editingStock to null after successful update', () => {
    component.editingStock = mockStocks[0] as any;
    component.updateStock();
    expect(component.editingStock).toBeNull();
  });

  it('should call deleteStock when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteStock(mockStocks[0] as any);
    expect(mockAdminService.deleteStock).toHaveBeenCalledWith(1);
  });

  it('should NOT call deleteStock when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    mockAdminService.deleteStock.calls.reset();
    component.deleteStock(mockStocks[0] as any);
    expect(mockAdminService.deleteStock).not.toHaveBeenCalled();
  });
});