import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './core/components/menu/menu.component';
import { SharedModule } from './modules/shared/shared.module';
import { PhantomProvider } from './core/wallet-providers/phantom.provider';
import { Contract } from './api/solana/contract';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule.withProviders(Contract, PhantomProvider),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
