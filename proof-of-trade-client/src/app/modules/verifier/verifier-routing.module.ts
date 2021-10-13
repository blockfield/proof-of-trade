import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignalsComponent } from './components/signals/signals.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { TraderComponent } from './components/trader/trader.component';
import { StrategiesComponent } from './components/strategies/strategies.component';
import { VerifierComponent } from './verifier.component';

const routes: Routes = [
  {
    path: '',
    component: VerifierComponent,
    children: [
      {
        path: 'traders',
        component: StrategiesComponent
      },
      {
        path: 'trader/:id',
        component: TraderComponent
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
