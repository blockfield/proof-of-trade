import { EthereumContractInterface } from "../interfaces/ethereum-contract.interface";

export class EthereumContract implements EthereumContractInterface {
    public getBlockNumber(): number {
        throw new Error("Method not implemented.");
    }
}