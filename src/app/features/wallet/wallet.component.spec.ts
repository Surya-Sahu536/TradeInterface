import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { WalletComponent } from './wallet.component';
import { WalletService } from '../../core/services/wallet.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

const mockWalletData = {
  fullName: 'Test User', email: 'test@test.com',
  walletBalance: 10000, totalDeposited: 10000, totalWithdrawn: 0,
  history: []
};

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  const mockWalletService = {
    getWallet:  jasmine.createSpy('getWallet').and.returnValue(of(mockWalletData)),
    deposit:    jasmine.createSpy('deposit').and.returnValue(of({ message: 'Added', newBalance: 11000 })),
    withdraw:   jasmine.createSpy('withdraw').and.returnValue(of({ message: 'Withdrawn', newBalance: 9000 }))
  };
  const mockAuth = {
    currentUser: { fullName: 'Test User', walletBalance: 10000 },
    updateBalance: jasmine.createSpy('updateBalance'),
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletComponent, NavbarComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: WalletService, useValue: mockWalletService },
        { provide: AuthService, useValue: mockAuth }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load wallet on init', () => {
    expect(mockWalletService.getWallet).toHaveBeenCalled();
    expect(component.walletData?.walletBalance).toBe(10000);
  });

  it('should set deposit amount on quick select', () => {
    component.setAmount('deposit', 5000);
    expect(component.depositAmount).toBe(5000);
  });

  it('should call deposit service', () => {
    component.depositAmount = 2000;
    component.deposit();
    expect(mockWalletService.deposit).toHaveBeenCalledWith(2000, undefined);
  });

  it('should call withdraw service', () => {
    component.withdrawAmount = 1000;
    component.withdraw();
    expect(mockWalletService.withdraw).toHaveBeenCalledWith(1000, undefined);
  });

  it('should update auth balance after deposit', () => {
    component.depositAmount = 1000;
    component.deposit();
    expect(mockAuth.updateBalance).toHaveBeenCalledWith(11000);
  });

  it('should show error toast on failed withdrawal', () => {
    mockWalletService.withdraw.and.returnValue(throwError({ error: { message: 'Insufficient balance' } }));
    component.withdrawAmount = 99999;
    component.withdraw();
    expect(component.toastType).toBe('error');
    expect(component.toastMessage).toContain('Insufficient balance');
  });
});
