export class WitnessModel {
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