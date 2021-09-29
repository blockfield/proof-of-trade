import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifierRoutingModule } from './verifier-routing.module';
import { VerifierComponent } from './verifier.component';
import { SharedModule } from '../shared/shared.module';
import { VerifierCardComponent } from './components/verifier-card/verifier-card.component';
import { Contract } from 'src/app/api/ethereum/contract';
import { MetaMaskProvider } from 'src/app/core/wallet-providers/meta-mask.provider';


@NgModule({
  declarations: [
    VerifierComponent,
    VerifierCardComponent,
  ],
  imports: [
    CommonModule,
    VerifierRoutingModule,
    SharedModule.withProviders(Contract, MetaMaskProvider),
  ]
})
export class VerifierModule { }
