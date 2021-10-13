import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";

import { VerifierRoutingModule } from './verifier-routing.module';
import { VerifierComponent } from './verifier.component';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { SignalsComponent } from './components/signals/signals.component';
import { TraderComponent } from './components/trader/trader.component';
import { StrategyCardComponent } from './components/strategies/components/strategy-card/strategy-card.component';
import { StrategiesComponent } from './components/strategies/strategies.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Contract } from 'src/app/api/solana/contract';
import { PhantomProvider } from 'src/app/core/wallet-providers/phantom.provider';


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
    SharedModule.withProviders(Contract, PhantomProvider),
    FontAwesomeModule,
    NgxSpinnerModule,
  ]
})
export class VerifierModule { }
