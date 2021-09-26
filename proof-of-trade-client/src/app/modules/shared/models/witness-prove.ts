export interface WitnessProve {
    actions: number[]
    amounts: number[]
    nonces: number[]
    balances: number[]
    previousBalanceHash: string
    hashes: string[]
    prices: number[]

    toParam(): object
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

    public toParam(): object {
        return {
            "type": [this.actions[0], this.actions[1]],
            "value": [this.amounts[0], this.amounts[1]],
            "salt": [this.nonces[0], this.nonces[1]],
            "previousBalance": [Math.round(this.balances[0]), Math.round(this.balances[1])],
            "previousBalanceHash": this.previousBalanceHash,
            "hash": [this.hashes[0], this.hashes[1]],
            "price": [Math.round(this.prices[0]), Math.round(this.prices[1]), Math.round(this.prices[2])]
        }
    }
}