import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProverRoutingModule } from './prover-routing.module';
import { ProverComponent } from './prover.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { AddSignalComponent } from './components/add-signal/add-signal.component';
import { GenerateProofComponent } from './components/generate-proof/generate-proof.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Contract } from 'src/app/api/ethereum/contract';
import { MetaMaskProvider } from 'src/app/core/wallet-providers/meta-mask.provider';
import { SignalsComponent } from './components/signals/signals.component';
import { ProofComponent } from './components/proof/proof.component';
import { FollowersComponent } from './components/followers/followers.component';
import { CurrencyComponent } from './components/add-signal/components/currency/currency.component';
import { AmountComponent } from './components/add-signal/components/amount/amount.component';
import { NonceComponent } from './components/add-signal/components/nonce/nonce.component';
import { ActionComponent } from './components/add-signal/components/action/action.component';
import { FinalComponent } from './components/add-signal/components/final/final.component';


@NgModule({
  declarations: [
    AddAccountComponent,
    AddSignalComponent,
    GenerateProofComponent,
    ProverComponent,
    SignalsComponent,
    ProofComponent,
    FollowersComponent,
    CurrencyComponent,
    AmountComponent,
    NonceComponent,
    ActionComponent,
    FinalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProverRoutingModule,
    SharedModule.withProviders(Contract, MetaMaskProvider),
  ]
})
export class ProverModule { }
