import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifierRoutingModule } from './verifier-routing.module';
import { VerifierComponent } from './verifier.component';
import { SharedModule } from '../shared/shared.module';
import { VerifierCardComponent } from './components/verifier-card/verifier-card.component';
import { Contract } from 'src/app/api/ethereum/contract';
import { MetaMaskProvider } from 'src/app/core/wallet-providers/meta-mask.provider';
import { TradersComponent } from './components/traders/traders.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { SignalsComponent } from './components/signals/signals.component';


@NgModule({
  declarations: [
    VerifierComponent,
    VerifierCardComponent,
    TradersComponent,
    SubscriptionsComponent,
    SignalsComponent,
  ],
  imports: [
    CommonModule,
    VerifierRoutingModule,
    SharedModule.withProviders(Contract, MetaMaskProvider),
  ]
})
export class VerifierModule { }
