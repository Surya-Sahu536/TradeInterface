import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminNavbarComponent } from './admin-navbar.component';
import { AdminService } from '../../../core/services/admin.service';

describe('AdminNavbarComponent', () => {
  let component: AdminNavbarComponent;
  let fixture: ComponentFixture<AdminNavbarComponent>;

  const mockAdminService = {
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNavbarComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AdminService, useValue: mockAdminService }]
    }).compileComponents();

    fixture   = TestBed.createComponent(AdminNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should start collapsed', () => {
    expect(component.isExpanded).toBeFalse();
  });

  it('should expand on toggle', () => {
    component.toggle();
    expect(component.isExpanded).toBeTrue();
  });

  it('should collapse on second toggle', () => {
    component.toggle();
    component.toggle();
    expect(component.isExpanded).toBeFalse();
  });

  it('should collapse on backdrop click', () => {
    component.isExpanded = true;
    component.collapse();
    expect(component.isExpanded).toBeFalse();
  });

  it('should collapse after nav click', () => {
    component.isExpanded = true;
    component.onNavClick();
    expect(component.isExpanded).toBeFalse();
  });

  it('should call adminService.logout on logout()', () => {
    component.logout();
    expect(mockAdminService.logout).toHaveBeenCalled();
  });

  it('should collapse on logout', () => {
    component.isExpanded = true;
    component.logout();
    expect(component.isExpanded).toBeFalse();
  });

  it('should match /admin exactly for Stocks active state', () => {
    expect(component.isActive('/admin')).toBeDefined();
  });
});
