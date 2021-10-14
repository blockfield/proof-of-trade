import { Component, OnInit } from '@angular/core';
import * as solanaWeb3 from '@solana/web3.js';
import * as pyth from '@pythnetwork/client';

import { ConnectedEvent } from './core/events/connected.event';
import { PriceService } from './modules/shared/services/price.service';
import { ToastService } from './modules/shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public title = 'proof-of-trade-client';
  public connectedEvent: ConnectedEvent|undefined = undefined
  public isAvailable = false

  public witness: ArrayBuffer|null = null;
  public provingKey: ArrayBuffer|null = null;
  public income: object;

  constructor(
    private priceService: PriceService,
    private toastr: ToastService
  ) {}

  ngOnInit(): void {
    this.initKeys()
    this.initPyth()
  }

  private initKeys(): void {
    // todo Maybe move to assets service if it works
    fetch("./assets/proving_key.bin").then( (response) => {
      return response.arrayBuffer();
    }).then( (b: ArrayBuffer) => {
        this.provingKey = b;
    });

    fetch("./assets/witness.bin").then( (response) => {
        return response.arrayBuffer();
    }).then( (b: ArrayBuffer) => {
        this.witness = b;
    });

    fetch("./assets/income.json").then( (response: Response) => {
        return response.json();
    }).then( (b: object) => {
        this.income = b;
    });
  }

  private initPyth(): void {
    // todo Move to environment.ts
    const SOLANA_CLUSTER_NAME = 'devnet';
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(SOLANA_CLUSTER_NAME));
    const pythConnection = new pyth.PythConnection(connection, pyth.getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME))
    pythConnection.onPriceChange((product, price) => {
      if (product.base !== 'BTC' || product.quote_currency !== 'USD') {
        return
      }

      this.priceService.nextBtcPrice(price.price)
    })

    this.priceService.subscribeToBtcPrice()
    pythConnection.start()
  }

  public onConnected(event: ConnectedEvent): void {
    this.connectedEvent = event

    if (this.connectedEvent.address) {
      this.toastr.success(this.connectedEvent.address.slice(0, 4) + '.....' + this.connectedEvent.address.slice(-4), 'Connected to wallet:')
      return
    }

    if (this.connectedEvent.error) {
      this.toastr.error('Connection to wallet failed')
      console.log(this.connectedEvent.error)
      return
    }
  }
}
