import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AdminMarketComponent } from './admin-market.component';
import { AdminService } from '../../core/services/admin.service';
import { AdminMarketService } from '../../core/services/admin-market.service';

describe('AdminMarketComponent', () => {
  let component: AdminMarketComponent;
  let fixture: ComponentFixture<AdminMarketComponent>;

  const mockAdminService = {
    getStocks: jasmine.createSpy('getStocks').and.returnValue(of([])),
    logout: jasmine.createSpy('logout')
  };
  const mockMarketService = {
    setSentiment:   jasmine.createSpy('setSentiment').and.returnValue(of({ message: 'Sentiment applied' })),
    triggerEvent:   jasmine.createSpy('triggerEvent').and.returnValue(of({ message: 'Event fired' })),
    setVolatility:  jasmine.createSpy('setVolatility').and.returnValue(of({ message: 'Volatility set' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMarketComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AdminService,       useValue: mockAdminService },
        { provide: AdminMarketService, useValue: mockMarketService }
      ]
    }).compileComponents();
    fixture   = TestBed.createComponent(AdminMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load stocks on init', () => {
    expect(mockAdminService.getStocks).toHaveBeenCalled();
  });

  it('should return correct sentiment label for bull', () => {
    expect(component.getSentimentLabel(0.8)).toContain('Bull');
  });

  it('should return correct sentiment label for bear', () => {
    expect(component.getSentimentLabel(-0.8)).toContain('Bear');
  });

  it('should return neutral for zero', () => {
    expect(component.getSentimentLabel(0)).toContain('Neutral');
  });

  it('should call setSentiment on submit', () => {
    component.sentimentValue = 0.5;
    component.submitSentiment();
    expect(mockMarketService.setSentiment).toHaveBeenCalledWith(0.5, jasmine.any(String));
  });

  it('should set event fields on selectEvent', () => {
    component.selectEvent(component.eventPresets[0]);
    expect(component.selectedEvent).toBeTruthy();
    expect(component.customImpact).toBe(component.eventPresets[0].impact);
  });

  it('should update volatilityMap after setVolatility', () => {
    component.setVolatility(1, 3.0);
    expect(component.volatilityMap[1]).toBe(3.0);
  });
});
