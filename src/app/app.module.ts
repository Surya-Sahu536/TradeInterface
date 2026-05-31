import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Feature Modules
import { AuthModule } from './features/auth/auth.module';
import { StocksModule } from './features/stocks/stocks.module';
import { AdminModule } from './features/admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StockDetailComponent } from './features/stocks/stock-detail.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    DashboardComponent,
    StockDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    SharedModule,
    CommonModule,
    //AuthModule,
    //DashboardModule,
    //StocksModule,
    AdminModule,
    AppRoutingModule   // always last
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
