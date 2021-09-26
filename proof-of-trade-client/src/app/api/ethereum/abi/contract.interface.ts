import { AbiItem } from "web3-utils";

export interface ContractInterface {
    address: string,
    abi: AbiItem[]
}