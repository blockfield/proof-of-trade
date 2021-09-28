import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { SmartContractInterface } from './interfaces/smart-contract.interface';
import { WalletProviderInterface } from './interfaces/wallet-provider.interface';



@NgModule({
  providers: []
})
export class SharedModule {
  static withProviders(contract: Type<SmartContractInterface>, walletProvider: Type<WalletProviderInterface>): ModuleWithProviders<SharedModule> {
    return {
       ngModule: SharedModule,
       providers: [
        { provide: 'SmartContractInterface', useClass: contract },
        { provide: 'WalletProviderInterface', useClass: walletProvider },
       ]
    };
  }
}
