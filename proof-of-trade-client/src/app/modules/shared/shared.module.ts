import { ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import { Contract as EthContract } from '../../api/ethereum/contract';
import { SmartContractInterface } from './interfaces/smart-contract.interface';
import { WalletProviderInterface } from './interfaces/wallet-provider.interface';



@NgModule({
  providers: [
    // { provide: 'SmartContractInterface', useClass: EthContract},
    // { provide: 'WalletProviderInterface', useClass: EthContract},
  ]
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
