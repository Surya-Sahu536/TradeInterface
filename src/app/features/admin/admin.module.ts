import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { AdminMarketComponent } from './admin-market.component';
import { AdminStocksComponent } from '../admin-stocks/admin-stocks.component';
import { AdminNavbarComponent } from 'src/app/shared/components/admin-navbar/admin-navbar.component';

const routes: Routes = [
  { path: 'stocks',       component: AdminStocksComponent  },
  { path: 'market', component: AdminMarketComponent  }
];

@NgModule({
  declarations: [
    AdminNavbarComponent,
    AdminStocksComponent, 
    AdminMarketComponent],
  imports: [SharedModule, FormsModule, MatSnackBarModule, RouterModule.forChild(routes)]
})
export class AdminModule { }
