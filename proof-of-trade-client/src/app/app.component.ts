import { Component, Inject, OnInit } from '@angular/core';
import { ConnectedEvent } from './core/events/connected.event';

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

  constructor() {}

  ngOnInit(): void {
    this.initKeys()
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

  public onConnected(event: ConnectedEvent): void {
    this.connectedEvent = event

    if (this.connectedEvent.address) {
      console.log('connected to phantom: ', this.connectedEvent.address)
      return
    }

    if (this.connectedEvent.error) {
      console.log('connection to phantom failed: ', this.connectedEvent.error)
      return
    }
  }
}
