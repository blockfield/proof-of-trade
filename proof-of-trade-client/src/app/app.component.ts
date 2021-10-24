import { Component, OnInit } from '@angular/core';
import * as solanaWeb3 from '@solana/web3.js';
import * as pyth from '@pythnetwork/client';

import { PriceService } from './modules/shared/services/price.service';
import MathHelper from './core/helpers/math.helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public title = 'proof-of-trade-client';
  public isAvailable = false

  public witness: ArrayBuffer|null = null;
  public provingKey: ArrayBuffer|null = null;
  public income: object;

  constructor(
    private priceService: PriceService,
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

      this.priceService.nextBtcPrice(MathHelper.decimalDigitsNumber(price.price))
    })

    this.priceService.subscribeToBtcPrice()
    pythConnection.start()
  }
}
