export interface WitnessVerify {
    balanceHash: string,
    balance: number,
    previousBalanceHash: string,
    hashes: string[],
    prices: number[],
    price_now: number

    toArray(): any[]
}

export class WitnessVerifyModel implements WitnessVerify {
    constructor(
        public balanceHash: string,
        public balance: number,
        public previousBalanceHash: string,
        public hashes: string[],
        public prices: number[],
        public price_now: number
    ) {}

    toArray(): any[] {
        let params = [
            this.balanceHash,
            this.balance,
            this.previousBalanceHash,
        ]

        params.push(...this.hashes, ...this.prices, this.price_now)

        return params
    }
}