import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface WalletTransaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
}

export interface WalletData {
  fullName: string;
  email: string;
  walletBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  history: WalletTransaction[];
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  walletBalance: number;
  memberSince: string;
  stats: {
    totalTrades: number;
    totalBuys: number;
    totalSells: number;
    holdingsCount: number;
  };
}

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly API = 'https://localhost:44328/api';

  constructor(private http: HttpClient) {}

  getWallet() {
    return this.http.get<WalletData>(`${this.API}/wallet`);
  }

  deposit(amount: number, note?: string) {
    return this.http.post<{ message: string; newBalance: number }>(
      `${this.API}/wallet/deposit`, { amount, note }
    );
  }

  withdraw(amount: number, note?: string) {
    return this.http.post<{ message: string; newBalance: number }>(
      `${this.API}/wallet/withdraw`, { amount, note }
    );
  }

  getProfile() {
    return this.http.get<UserProfile>(`${this.API}/profile`);
  }

  updateProfile(fullName: string) {
    return this.http.put<{ fullName: string; message: string }>(
      `${this.API}/profile`, { fullName }
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<{ message: string }>(
      `${this.API}/profile/change-password`, { currentPassword, newPassword }
    );
  }
}
