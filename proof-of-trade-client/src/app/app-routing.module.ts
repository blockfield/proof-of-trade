import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
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
    redirectTo: 'user',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
