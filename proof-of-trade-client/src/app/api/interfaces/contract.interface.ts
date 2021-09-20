export interface ContractInterface {
    newTrader(email: string): void 
    addSignal(hash: string): void
    getTradeLen(): number
    getSignal(address: string, index: number): Signal
    getProofLen(address: string): number
    getPrevBalanceHash(address: string, index: number): string
    addPeriodProof(witnessProof: ProofResult): void
}

export class Signal {
    constructor(
        public blockNumber: number,
        public hash: string
    ) {}
}

export class Proof {
    constructor(
        public pi_a: number[],
        public pi_b: number[][],
        public pi_c: number[]
    ) {}
}

export class ProofResult {
    constructor(
      public pi_a: number[],
      public pi_b: number[][],
      public pi_c: number[],
      public publicSignals: number[],
    ) {}
  }