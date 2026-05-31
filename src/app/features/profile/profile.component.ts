import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { WalletService, UserProfile } from '../../core/services/wallet.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  saving:any = false;

  editName: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showCurrentPwd: boolean = false;
  showNewPwd: boolean = false;
  showConfirmPwd: boolean = false;

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  constructor(
    private walletService: WalletService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.walletService.getProfile().subscribe(
      p => {
        this.profile = p;
        this.editName = p.fullName;
      },
      err => console.error('Failed to load profile', err)
    );
  }

  getInitials(): string {
    if (!this.profile?.fullName) return '?';
    return this.profile.fullName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  updateProfile() {
    if (!this.editName.trim()) return;
    this.saving = true;
    this.walletService.updateProfile(this.editName).subscribe(
      res => {
        if (this.profile) this.profile.fullName = res.fullName;
        this.showToast('Profile updated successfully.', 'success');
        this.saving = false;
      },
      err => {
        this.showToast(err.error?.message || 'Update failed.', 'error');
        this.saving = false;
      }
    );
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.showToast('Passwords do not match.', 'error');
      return;
    }
    if (this.newPassword.length < 6) {
      this.showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    this.saving = true;
    this.walletService.changePassword(this.currentPassword, this.newPassword).subscribe(
      res => {
        this.showToast(res.message, 'success');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.saving = false;
      },
      err => {
        this.showToast(err.error?.message || 'Password change failed.', 'error');
        this.saving = false;
      }
    );
  }

  logout() {
    this.auth.logout();
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage = '', 4000);
  }
}
