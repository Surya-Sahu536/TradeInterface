import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { PriceSignalRService } from '../../core/services/price-signalr.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="brand">
          <span class="brand-icon">📈</span>
          <h1>TradeCenter</h1>
          <p>Create your account — get ₹10,000 virtual balance</p>
        </div>

        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" required placeholder="John Doe" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Min 8 characters" />
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0e1a; }
    .auth-card { width: 400px; background: #0f1629; border: 1px solid #1e2d4a; border-radius: 12px; padding: 40px; }
    .brand { text-align: center; margin-bottom: 32px; }
    .brand-icon { font-size: 40px; }
    .brand h1 { color: #00d4aa; font-size: 28px; margin: 8px 0 4px; }
    .brand p { color: #6b7a99; font-size: 13px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; color: #8892a4; font-size: 13px; margin-bottom: 6px; }
    input { width: 100%; padding: 12px 16px; background: #1a2540; border: 1px solid #2a3a5c; border-radius: 8px; color: #e0e6f0; font-size: 15px; box-sizing: border-box; transition: border 0.2s; }
    input:focus { outline: none; border-color: #00d4aa; }
    .btn-primary { width: 100%; padding: 13px; background: #00d4aa; color: #0a0e1a; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
    .btn-primary:hover:not(:disabled) { background: #00b894; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 24px; }
    .auth-footer p { color: #6b7a99; font-size: 14px; }
    .auth-footer a { color: #00d4aa; text-decoration: none; }
  `]
})
export class RegisterComponent {
  fullName = ''; email = ''; password = ''; loading = false;

  constructor(private auth: AuthService, private signalR: PriceSignalRService, private router: Router, private snack: MatSnackBar) {}

  onRegister() {
    this.loading = true;
    this.auth.register({ fullName: this.fullName, email: this.email, password: this.password }).subscribe(
      () => {
        this.signalR.connect();
        this.router.navigate(['/dashboard']);
      },
      err => {
        this.snack.open(err.error?.message || 'Registration failed', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }
}
