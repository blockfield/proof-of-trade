import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './core/components/menu/menu.component';
import { SharedModule } from './modules/shared/shared.module';
import { HomeComponent } from './core/components/home/home.component';
import { ConnectionComponent } from './core/components/connection/connection.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Contract } from './api/solana/contract';
import { PhantomProvider } from './core/wallet-providers/phantom.provider';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    ConnectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    SharedModule.withProviders(Contract, PhantomProvider),
    ToastrModule.forRoot(),
    FontAwesomeModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
