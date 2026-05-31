import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

export interface PriceUpdate {
  stockId: number;
  price: number;
  changePercent: number;
  availableShares: number;   // ← live share count from backend
}

@Injectable({ providedIn: 'root' })
export class PriceSignalRService implements OnDestroy {
  private hub!: signalR.HubConnection;
  priceUpdate$ = new Subject<PriceUpdate>();

  constructor(private auth: AuthService) {}

  connect() {
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44328/hubs/prices?access_token=${this.auth.token}`)
      .withAutomaticReconnect()
      .build();

    this.hub.on('ReceivePriceUpdate',
      (stockId: number, price: number, changePercent: number, availableShares: number) => {
        this.priceUpdate$.next({ stockId, price, changePercent, availableShares });
      });

    this.hub.start().catch(err => console.error('SignalR error:', err));
  }

  disconnect() { this.hub?.stop(); }
  ngOnDestroy() { this.disconnect(); }
}
