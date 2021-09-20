import { ContractInterface, Proof, ProofResult, Signal } from "../interfaces/contract.interface";

export class Contract implements ContractInterface {
    public newTrader(email: string): void {
        throw new Error("Method not implemented.");
    }

    public addSignal(hash: string): void {
        throw new Error("Method not implemented.");
    }

    public getTradeLen(): number {
        throw new Error("Method not implemented.");
    }

    public getSignal(address: string, index: number): Signal {
        throw new Error("Method not implemented.");
    }

    public getProofLen(address: string): number {
        throw new Error("Method not implemented.");
    }

    public getPrevBalanceHash(address: string, index: number): string {
        throw new Error("Method not implemented.");
    }

    public addPeriodProof(witnessProof: ProofResult): void {
        throw new Error("Method not implemented.");
    }
}