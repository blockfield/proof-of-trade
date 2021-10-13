import { Injectable } from "@angular/core"
import { WalletProviderInterface } from "src/app/modules/shared/interfaces/wallet-provider.interface"

@Injectable()
export class MetaMaskProvider implements WalletProviderInterface {
    public async connect(): Promise<string|null> {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })

        return accounts.length > 0 ? accounts[0] as string : null
    }
}