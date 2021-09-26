import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProverComponent } from './prover.component';

const routes: Routes = [{ path: '', component: ProverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProverRoutingModule { }
