export interface WitnessProve {
    type: number[]
    value: number[]
    salt: number[]
    previousBalance: number[]
    previousBalanceHash: string
    hash: string[]
    price: number[]
}

export class WitnessProveModel implements WitnessProve {
    constructor(
        public type: number[],
        public value: number[],
        public salt: number[],
        public previousBalance: number[],
        public previousBalanceHash: string,
        public hash: string[],
        public price: number[]
    ) {}
}