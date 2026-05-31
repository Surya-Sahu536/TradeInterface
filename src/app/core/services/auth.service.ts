import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'https://localhost:44328/api/auth';
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null { return this.userSubject.value; }
  get token(): string | null { return this.userSubject.value?.token ?? null; }
  get isLoggedIn(): boolean { return !!this.userSubject.value; }

  register(data: { fullName: string; email: string; password: string }) {
    console.log('Registering user:', data, 'API endpoint:', this.API + '/register');
    return this.http.post<User>(this.API + '/register', data).pipe(
      tap(user => this.saveUser(user))
    );
    
  }

  login(data: { email: string; password: string }) {
    console.log('Logging in user:', data);
    return this.http.post<User>(this.API + '/login', data).pipe(
      tap(user => this.saveUser(user))
    );
  }

  logout() {
    localStorage.removeItem('tc_user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  updateBalance(balance: number) {
    const user = this.userSubject.value;
    if (user) {
      const updated = { ...user, walletBalance: balance };
      this.saveUser(updated);
    }
  }

  private saveUser(user: User) {
    localStorage.setItem('tc_user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  private loadUser(): User | null {
    const stored = localStorage.getItem('tc_user');
    return stored ? JSON.parse(stored) : null;
  }
}
