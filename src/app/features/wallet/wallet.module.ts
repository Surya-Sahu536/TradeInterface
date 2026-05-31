import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WalletComponent } from './wallet.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: WalletComponent }
];

@NgModule({
  declarations: [WalletComponent],
  imports: [CommonModule,FormsModule,SharedModule, RouterModule.forChild(routes)]
})
export class WalletModule { }
