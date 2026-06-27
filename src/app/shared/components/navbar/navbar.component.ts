import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(
    public auth: AuthService,
    public theme: ThemeService
  ) {}

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() { this.menuOpen = false; }

  toggleTheme(event: MouseEvent) {
    event.stopPropagation(); // prevent dropdown from closing
    this.theme.toggle();
  }

  @HostListener('document:click')
  onDocumentClick() { this.menuOpen = false; }

  getInitials(): string {
    const name = this.auth.currentUser?.fullName ?? '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
  }
}