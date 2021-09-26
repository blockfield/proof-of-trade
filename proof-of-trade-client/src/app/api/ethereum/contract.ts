import Web3 from "web3";
import { PeriodProofResponseInterface, SignalResponseInterface, SmartContractInterface, WitnessProofRequestInterface } from "src/app/modules/shared/interfaces/smart-contract.interface"
import { tradeContract } from "./abi/trade.contract";
import { oracleContract } from "./abi/oracle.contract";
import { Injectable } from "@angular/core";
import { WalletService } from "../../modules/shared/services/wallet.service";

@Injectable({
    providedIn: 'root'
})
export class Contract implements SmartContractInterface {
    private web3: Web3
    private contract: any
    private oracle: any
    private account: string

    constructor(walletService: WalletService) {
        this.web3 = new Web3((window as any).ethereum)
        this.contract = new this.web3.eth.Contract(tradeContract.abi, tradeContract.address)
        this.oracle = new this.web3.eth.Contract(oracleContract.abi, oracleContract.address)
        this.account = walletService.getAddress()
    }

    public async newTrader(email: string): Promise<void> {
        return await this.contract.methods.newTrader(email).send({ from: this.account })
    }

    public async addSignal(hash: string): Promise<void> {
        return await this.contract.methods.addSignal(hash).send({ from: this.account })
    }

    public async getTradeLen(): Promise<number> {
        return +(await this.contract.methods.getTradeLen(this.account).call())
    }

    public async getSignal(address: string, index: number): Promise<SignalResponseInterface> {
        return await this.contract.methods.signals(address, index).call()
    }

    public async getProofLen(address: string): Promise<number> {
        return +(await this.contract.methods.getProofLen(address).call())
    }

    public async getPrevBalanceHash(address: string, index: number): Promise<string> {
        return (await this.contract.methods.periodProofs(address, index).call()).newBalanceHash
    }

    public async addPeriodProof(request: WitnessProofRequestInterface, currentBlock: number): Promise<void> {
        let proof = {
              pi_a: [this.web3.eth.abi.encodeParameter('uint256', request.pi_a[0]), this.web3.eth.abi.encodeParameter('uint256', request.pi_a[1])],
              pi_b: [[
                  this.web3.eth.abi.encodeParameter('uint256', request.pi_b[0][0]), this.web3.eth.abi.encodeParameter('uint256', request.pi_b[0][1])
              ], [
                  this.web3.eth.abi.encodeParameter('uint256', request.pi_b[1][0]), this.web3.eth.abi.encodeParameter('uint256', request.pi_b[1][1])
              ]],
              pi_c: [this.web3.eth.abi.encodeParameter('uint256', request.pi_c[0]), this.web3.eth.abi.encodeParameter('uint256', request.pi_c[1])]
          };

        await this.contract.methods
            .addPeriodProof(request.publicSignals[1], proof, request.publicSignals[0], currentBlock)
            .send({ from: this.account })
    }

    public async currentAnswer(blockNumber: number): Promise<number> {
        return +(await this.oracle.methods.currentAnswer().call(blockNumber))
    }

    public async getBlockNumber(): Promise<number> {
        return +(await this.web3.eth.getBlockNumber())
    }

    public async getTradersCount(): Promise<number> {
        return +(await this.contract.methods.getTradersCount().call())
    }

    public async getTrader(index: number): Promise<string> {
        return await this.contract.methods.traders(index).call()
    }

    public async getEmail(address: string): Promise<string> {
        return await this.contract.methods.emails(address).call()
    }

    public async getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        return await this.contract.methods.periodProofs(address, index).call()
    }

}