import { OracleContractInterface } from "../interfaces/oracle-contract.interface";

export class OracleContract implements OracleContractInterface {
    public currentAnswer(blockNumber: number): number {
        throw new Error("Method not implemented.");
    }
}