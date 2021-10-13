import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/verifier/verifier.module').then(m => m.VerifierModule)
  },
  {
    path: 'trader',
    loadChildren: () => import('./modules/prover/prover.module').then(m => m.ProverModule)
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
