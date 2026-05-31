import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { WalletService } from '../../core/services/wallet.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

const mockProfile = {
  id: 1, fullName: 'John Doe', email: 'john@test.com',
  walletBalance: 10000, memberSince: '2024-01-01T00:00:00Z',
  stats: { totalTrades: 10, totalBuys: 7, totalSells: 3, holdingsCount: 4 }
};

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockWalletService = {
    getProfile:     jasmine.createSpy('getProfile').and.returnValue(of(mockProfile)),
    updateProfile:  jasmine.createSpy('updateProfile').and.returnValue(of({ fullName: 'Jane Doe', message: 'Updated' })),
    changePassword: jasmine.createSpy('changePassword').and.returnValue(of({ message: 'Password changed' }))
  };
  const mockAuth = {
    currentUser: { fullName: 'John Doe', walletBalance: 10000 },
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent, NavbarComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: WalletService, useValue: mockWalletService },
        { provide: AuthService, useValue: mockAuth }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load profile on init', () => {
    expect(mockWalletService.getProfile).toHaveBeenCalled();
    expect(component.profile?.fullName).toBe('John Doe');
  });

  it('should populate editName from profile', () => {
    expect(component.editName).toBe('John Doe');
  });

  it('should return correct initials', () => {
    expect(component.getInitials()).toBe('JD');
  });

  it('should call updateProfile', () => {
    component.editName = 'Jane Doe';
    component.updateProfile();
    expect(mockWalletService.updateProfile).toHaveBeenCalledWith('Jane Doe');
  });

  it('should show error if passwords do not match', () => {
    component.newPassword = 'abc123';
    component.confirmPassword = 'xyz789';
    component.changePassword();
    expect(component.toastType).toBe('error');
    expect(component.toastMessage).toContain('do not match');
  });

  it('should call changePassword when passwords match', () => {
    component.currentPassword = 'old123';
    component.newPassword = 'new123';
    component.confirmPassword = 'new123';
    component.changePassword();
    expect(mockWalletService.changePassword).toHaveBeenCalledWith('old123', 'new123');
  });

  it('should call auth.logout on logout()', () => {
    component.logout();
    expect(mockAuth.logout).toHaveBeenCalled();
  });
});
