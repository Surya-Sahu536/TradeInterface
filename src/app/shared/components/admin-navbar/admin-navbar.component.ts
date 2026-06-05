import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

  isExpanded = false;

  constructor(
    public adminService: AdminService,
    private router: Router
  ) {}

  toggle()   { this.isExpanded = !this.isExpanded; }
  collapse() { this.isExpanded = false; }

  // Close sidebar after nav click (good UX on smaller screens)
  onNavClick() { this.isExpanded = false; }

  logout() {
    this.isExpanded = false;
    this.adminService.logout();
  }

  isActive(path: string): boolean {
    // exact match for /admin, prefix match for /admin/market
    if (path === '/admin') {
      return this.router.url === '/admin';
    }
    return this.router.url.startsWith(path);
  }
}
