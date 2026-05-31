import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(): boolean {
    const admin = JSON.parse(localStorage.getItem('tc_admin') || 'null');
    if (admin?.token) return true;
    this.router.navigate(['/auth/admin-login']);
    return false;
  }
}
