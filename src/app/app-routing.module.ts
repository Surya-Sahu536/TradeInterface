import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StockDetailComponent } from './features/stocks/stock-detail.component';
import { ProfileComponent } from './features/profile/profile.component';
import { WalletComponent } from './features/wallet/wallet.component';


const routes: Routes = [
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  //{ path: 'profile', component: ProfileComponent},
  //{ path: 'wallet', component: WalletComponent },
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: 'wallet', loadChildren: () => import('./features/wallet/wallet.module').then(m => m.WalletModule), canActivate: [AuthGuard] },
  { path: 'stocks/:id', component: StockDetailComponent, canActivate: [AuthGuard] },
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  //{ path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  //{ path: 'stocks', loadChildren: () => import('./features/stocks/stocks.module').then(m => m.StocksModule), canActivate: [AuthGuard] },
  //{ path: 'portfolio', loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule), canActivate: [AuthGuard] },
  
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard] },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
