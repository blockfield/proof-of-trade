export interface WitnessProve {
    actions: number[],
    amounts: number[],
    nonces: number[],
    balances: number[],
    previousBalanceHash: string,
    hashes: string[],
    prices: number[]
}

export class WitnessProveModel implements WitnessProve {
    constructor(
        public actions: number[],
        public amounts: number[],
        public nonces: number[],
        public balances: number[],
        public previousBalanceHash: string,
        public hashes: string[],
        public prices: number[]
    ) {}

}