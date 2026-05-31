import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { WalletService, WalletData } from '../../core/services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  walletData: WalletData | null = null;
  loading = false;

  depositAmount: any = null;
  depositNote: string = '';
  withdrawAmount: any = null;
  withdrawNote: string = '';

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  quickAmounts = [1000, 5000, 10000, 25000];

  constructor(
    private walletService: WalletService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadWallet();
  }

  loadWallet() {
    this.walletService.getWallet().subscribe(
      (      data: any) => this.walletData = data,
      (      err: any)  => console.error('Failed to load wallet', err)
    );
  }

  setAmount(type: 'deposit' | 'withdraw', amount: number) {
    if (type === 'deposit') this.depositAmount = amount;
    else this.withdrawAmount = amount;
  }

  withdrawAll() {
    if (this.walletData) this.withdrawAmount = this.walletData.walletBalance;
  }

  deposit() {
    if (!this.depositAmount || this.depositAmount <= 0) return;
    this.loading = true;
    this.walletService.deposit(this.depositAmount, this.depositNote || undefined).subscribe(
      (      res: { newBalance: number; message: string; }) => {
        this.auth.updateBalance(res.newBalance);
        this.showToast(res.message, 'success');
        this.depositAmount = null;
        this.depositNote = '';
        this.loading = false;
        this.loadWallet();
      },
      (      err: any) => {
        this.showToast(err.error?.message || 'Deposit failed.', 'error');
        this.loading = false;
      }
    );
  }

  withdraw() {
    if (!this.withdrawAmount || this.withdrawAmount <= 0) return;
    this.loading = true;
    this.walletService.withdraw(this.withdrawAmount, this.withdrawNote || undefined).subscribe(
      (      res: { newBalance: number; message: string; }) => {
        this.auth.updateBalance(res.newBalance);
        this.showToast(res.message, 'success');
        this.withdrawAmount = null;
        this.withdrawNote = '';
        this.loading = false;
        this.loadWallet();
      },
      (      err: any) => {
        this.showToast(err.error?.message || 'Withdrawal failed.', 'error');
        this.loading = false;
      }
    );
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage = '', 4000);
  }
}
