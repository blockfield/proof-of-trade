import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifierRoutingModule } from './verifier-routing.module';
import { VerifierComponent } from './verifier.component';
import { SharedModule } from '../shared/shared.module';
import { Contract } from 'src/app/api/ethereum/contract';
import { MetaMaskProvider } from 'src/app/core/wallet-providers/meta-mask.provider';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { SignalsComponent } from './components/signals/signals.component';
import { TraderComponent } from './components/trader/trader.component';
import { StrategyCardComponent } from './components/strategy-card/strategy-card.component';
import { StrategiesComponent } from './components/strategies/strategies.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    VerifierComponent,
    StrategyCardComponent,
    StrategiesComponent,
    SubscriptionsComponent,
    SignalsComponent,
    TraderComponent,
  ],
  imports: [
    CommonModule,
    VerifierRoutingModule,
    SharedModule.withProviders(Contract, MetaMaskProvider),
    FontAwesomeModule,
  ]
})
export class VerifierModule { }
