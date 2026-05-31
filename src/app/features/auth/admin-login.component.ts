import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="brand">
          <span class="brand-icon">🛡️</span>
          <h1>Admin Portal</h1>
          <p>TradeCenter Administration</p>
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Admin Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="admin@tradecenter.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="btn-admin" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Admin Sign In' }}
          </button>
        </form>
        <div class="auth-footer">
          <p><a routerLink="/auth/login">← Back to User Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0e1a; }
    .auth-card { width: 400px; background: #0f1629; border: 1px solid #2d1a4a; border-radius: 12px; padding: 40px; }
    .brand { text-align: center; margin-bottom: 32px; }
    .brand-icon { font-size: 40px; }
    .brand h1 { color: #c084fc; font-size: 28px; margin: 8px 0 4px; }
    .brand p { color: #6b7a99; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; color: #8892a4; font-size: 13px; margin-bottom: 6px; }
    input { width: 100%; padding: 12px 16px; background: #1a1a40; border: 1px solid #2a2a5c; border-radius: 8px; color: #e0e6f0; font-size: 15px; box-sizing: border-box; transition: border 0.2s; }
    input:focus { outline: none; border-color: #c084fc; }
    .btn-admin { width: 100%; padding: 13px; background: #7c3aed; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
    .btn-admin:hover:not(:disabled) { background: #6d28d9; }
    .btn-admin:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 24px; }
    .auth-footer a { color: #c084fc; text-decoration: none; font-size: 14px; }
  `]
})
export class AdminLoginComponent {
  email = ''; password = ''; loading = false;

  constructor(private admin: AdminService, private router: Router, private snack: MatSnackBar) {}

  onLogin() {
    this.loading = true;
    this.admin.login(this.email, this.password).subscribe(
      () => this.router.navigate(['/admin']),
      err => {
        this.snack.open(err.error?.message || 'Login failed', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }
}
