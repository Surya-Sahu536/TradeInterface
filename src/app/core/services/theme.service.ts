import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly STORAGE_KEY = 'tc_theme';
  private isDarkSubject = new BehaviorSubject<boolean>(this.loadTheme());
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    // Apply theme immediately on service init (before any component renders)
    this.applyTheme(this.isDarkSubject.value);
  }

  get isDark(): boolean {
    return this.isDarkSubject.value;
  }

  toggle() {
    const newValue = !this.isDarkSubject.value;
    this.isDarkSubject.next(newValue);
    localStorage.setItem(this.STORAGE_KEY, newValue ? 'dark' : 'light');
    this.applyTheme(newValue);
  }

  setDark(value: boolean) {
    this.isDarkSubject.next(value);
    localStorage.setItem(this.STORAGE_KEY, value ? 'dark' : 'light');
    this.applyTheme(value);
  }

  private applyTheme(dark: boolean) {
    const body = document.body;
    if (dark) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }

  private loadTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    // Default to dark mode since the app was designed dark
    return stored === null ? true : stored === 'dark';
  }
}