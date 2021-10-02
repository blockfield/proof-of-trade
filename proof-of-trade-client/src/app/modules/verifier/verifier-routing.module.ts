import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignalsComponent } from './components/signals/signals.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { TradersComponent } from './components/traders/traders.component';
import { VerifierComponent } from './verifier.component';

const routes: Routes = [
  {
    path: '',
    component: VerifierComponent,
    children: [
      {
        path: 'traders',
        component: TradersComponent
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent
      },
      {
        path: 'signals',
        component: SignalsComponent
      },
      {
        path: '**',
        redirectTo: 'traders'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifierRoutingModule { }
