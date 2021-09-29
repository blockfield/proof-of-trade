import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifierRoutingModule } from './verifier-routing.module';
import { VerifierComponent } from './verifier.component';
import { SharedModule } from '../shared/shared.module';
import { VerifierCardComponent } from './components/verifier-card/verifier-card.component';
import { Contract } from 'src/app/api/solana/contract';
import { PhantomProvider } from 'src/app/core/wallet-providers/phantom.provider';


@NgModule({
  declarations: [
    VerifierComponent,
    VerifierCardComponent,
  ],
  imports: [
    CommonModule,
    VerifierRoutingModule,
    SharedModule.withProviders(Contract, PhantomProvider),
  ]
})
export class VerifierModule { }
