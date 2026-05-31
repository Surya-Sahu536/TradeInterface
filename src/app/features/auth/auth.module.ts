import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { AdminLoginComponent } from './admin-login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AdminLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
