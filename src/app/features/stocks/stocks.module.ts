import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { StockDetailComponent } from './stock-detail.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  //{ path: ':id', component: StockDetailComponent }
];

@NgModule({
  declarations: [],
  imports: [SharedModule, CommonModule, FormsModule, MatSnackBarModule, RouterModule.forChild(routes)]
})
export class StocksModule { }
