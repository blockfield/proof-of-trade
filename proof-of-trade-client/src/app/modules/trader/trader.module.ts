import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraderRoutingModule } from './trader-routing.module';
import { TraderComponent } from './trader.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { AddSignalComponent } from './components/add-signal/add-signal.component';
import { GenerateProofComponent } from './components/generate-proof/generate-proof.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddAccountComponent,
    AddSignalComponent,
    GenerateProofComponent,
    TraderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TraderRoutingModule
  ]
})
export class TraderModule { }
