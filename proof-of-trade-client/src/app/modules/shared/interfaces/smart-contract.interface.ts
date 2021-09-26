export interface SmartContractInterface {
    newTrader(email: string): Promise<void>
    addSignal(hash: string): Promise<void>
    getTradeLen(): Promise<number>
    getSignal(address: string, index: number): Promise<SignalResponseInterface>
    getProofLen(address: string): Promise<number>
    getPrevBalanceHash(address: string, index: number): Promise<string>
    addPeriodProof(witnessProof: WitnessProofRequestInterface, currentBlock: number): Promise<void>
    currentAnswer(blockNumber: number): Promise<number>
    getBlockNumber(): Promise<number>

    getTradersCount(): Promise<number>
    getTrader(index: number): Promise<string>
    getEmail(address: string): Promise<string>
    getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface>
}

export interface SignalResponseInterface {
    blockNumber: number
    hash: string
}

export interface WitnessProofRequestInterface {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    publicSignals: number[]
}

export interface PeriodProofResponseInterface {
    y: number,
    newBalanceHash: string,
    blockNumber: number,
    proof: {
        pi_a: string[],
        pi_b: string[][],
        pi_c: string[]
    }
}