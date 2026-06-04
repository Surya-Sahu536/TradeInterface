import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminStock } from '../models/models';

interface AdminUser { email: string; role: string; token: string; }

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = 'https://localhost:44329/api/admin';
  private adminSubject = new BehaviorSubject<AdminUser | null>(this.loadAdmin());

  constructor(private http: HttpClient, private router: Router) {}

  get currentAdmin(): AdminUser | null { return this.adminSubject.value; }
  get token(): string | null { return this.adminSubject.value?.token ?? null; }
  get isAdmin(): boolean { return !!this.adminSubject.value; }

  login(email: string, password: string) {
    return this.http.post<AdminUser>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(admin => {
        localStorage.setItem('tc_admin', JSON.stringify(admin));
        this.adminSubject.next(admin);
      })
    );
  }

  logout() {
    localStorage.removeItem('tc_admin');
    this.adminSubject.next(null);
    this.router.navigate(['/auth/admin-login']);
  }

  getStocks() { return this.http.get<AdminStock[]>(`${this.API}/stocks`); }

  createStock(data: { symbol: string; companyName: string; sector: string; initialPrice: number }) {
    return this.http.post<AdminStock>(`${this.API}/stocks`, data);
  }

  updateStock(id: number, data: { companyName: string; sector: string; currentPrice: number; isActive: boolean }) {
    return this.http.put<AdminStock>(`${this.API}/stocks/${id}`, data);
  }

  deleteStock(id: number) {
    return this.http.delete(`${this.API}/stocks/${id}`);
  }

  // admin.service.ts
  issueShares(stockId: number, additionalShares: number) {
    return this.http.post<{ message: string; totalShares: number; availableShares: number }>(
      `${this.API}/stocks/${stockId}/issue-shares`,
      { additionalShares, reason: 'Admin issued shares' }
    );
  }

  private loadAdmin(): AdminUser | null {
    const s = localStorage.getItem('tc_admin');
    return s ? JSON.parse(s) : null;
  }
}
