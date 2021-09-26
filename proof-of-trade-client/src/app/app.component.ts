import { Component, OnInit } from '@angular/core';
import { ConnectedEvent } from './core/events/connected.event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public title = 'proof-of-trade-client';
  public connectedEvent: ConnectedEvent|undefined = undefined

  public witness: ArrayBuffer|null = null;
  public provingKey: ArrayBuffer|null = null;
  // public publicSignals: any;
  public income: any;

  ngOnInit(): void {
    this.initKeys()
  }

  private initKeys(): void {
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

    // fetch("./assets/public.json").then( (response: Response) => {
    //     return response.json();
    // }).then( (b: any) => {
    //     this.publicSignals = b;
    // });

    fetch("./assets/income.json").then( (response: Response) => {
        return response.json();
    }).then( (b: any) => {
        this.income = b;
    });
  }

  public onConnected(event: ConnectedEvent): void {
    this.connectedEvent = event

    if (this.connectedEvent.address) {
      console.log('connected to metamask: ', this.connectedEvent.address)
      return
    }

    if (this.connectedEvent.error) {
      console.log('connection to metamask failed: ', this.connectedEvent.error)
      return
    }

    console.log('something went wrong, refresh page')
  }
}
