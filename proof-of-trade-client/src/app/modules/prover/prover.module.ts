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


@NgModule({
  declarations: [
    AddAccountComponent,
    AddSignalComponent,
    GenerateProofComponent,
    ProverComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProverRoutingModule,
    SharedModule.withProviders(Contract, MetaMaskProvider),
  ]
})
export class ProverModule { }
