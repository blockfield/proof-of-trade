import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowersComponent } from './components/followers/followers.component';
import { ProofComponent } from './components/proof/proof.component';
import { SignalsComponent } from './components/signals/signals.component';
import { ProverComponent } from './prover.component';

const routes: Routes = [
  {
    path: '',
    component: ProverComponent,
    children: [
      {
        path: 'signals',
        component: SignalsComponent
      },
      {
        path: 'proof',
        component: ProofComponent
      },
      {
        path: 'followers',
        component: FollowersComponent
      },
      {
        path: '**',
        redirectTo: 'signals'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProverRoutingModule { }
