export interface WalletProviderInterface {
    connect(): Promise<string|null>
}