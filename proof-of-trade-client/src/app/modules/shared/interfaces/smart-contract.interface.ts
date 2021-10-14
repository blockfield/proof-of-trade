export interface SmartContractInterface {
    newTrader(email: string): Promise<void>
    addSignal(hash: string): Promise<void>
    getTradeLen(): Promise<number>
    getSignal(address: string, index: number): Promise<SignalResponseInterface>
    getProofLen(address: string): Promise<number>
    getPrevBalanceHash(address: string, index: number): Promise<string>
    addPeriodProof(witnessProof: WitnessProofRequestInterface, prices: bigint[]): Promise<void>

    getTradersCount(): Promise<number>
    getTrader(index: number|null): Promise<TraderResponseInterface>
    getEmail(address: string): Promise<string>
    getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface>
    getPeriodProofsPage(address: string, index: number): Promise<PeriodProofResponseInterface[]>

    getTimestampByBlockNumber(blockNumber: bigint): Promise<number>
}

export interface TraderResponseInterface {
    address: string,
    email: string,
    signalsCount: number,
    proofsCount: number,
    creationBlockNumber: bigint,
}

export interface SignalResponseInterface {
    blockNumber: bigint
    hash: string
    price: bigint
}

export interface WitnessProofRequestInterface {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    publicSignals: string[]
}

export interface PeriodProofResponseInterface {
    y: number,
    newBalanceHash: string,
    blockNumber: bigint,
    proof: {
        pi_a: string[],
        pi_b: string[][],
        pi_c: string[]
    },
    prices: bigint[]
}