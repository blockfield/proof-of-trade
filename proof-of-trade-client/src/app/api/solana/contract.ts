import { Injectable } from "@angular/core";
import * as BN from 'bn.js';
import { PeriodProofResponseInterface, SignalResponseInterface, SmartContractInterface, TraderResponseInterface, WitnessProofRequestInterface } from "src/app/modules/shared/interfaces/smart-contract.interface";
import { WalletService } from "src/app/modules/shared/services/wallet.service";
import { Proof, SolanaWeb3Contract } from "./solana-web3-contract";

@Injectable({
    providedIn: 'root'
})
export class Contract extends SolanaWeb3Contract implements SmartContractInterface {
    constructor(walletService: WalletService) {
        super(walletService.getAddress())
    }

    public async newTrader(email: string): Promise<void> {
        await this.createTraderAction(email)
    }

    public async addSignal(hash: string): Promise<void> {
        let prices: bigint[] = []

        await this.addSignalAction({
            blockNumber: BigInt(0),
            hash: (new BN(hash)).toBuffer(),
            prices: prices,
        })
    }

    public async getTradeLen(): Promise<number> {
        return Number((await this.getTraderAction(this.myPK.toString())).signalsCount)
    }

    public async getSignal(address: string, index: number): Promise<SignalResponseInterface> {
        let signals = await this.getSignalsFromPageAction(address, BigInt(Math.floor(index/10)))
        const signal = signals[index % 10]

        return {
            blockNumber: signal.blockNumber,
            hash: (new BN(signal.hash)).toString(),
            price: signal.prices[0]
        }
    }

    public async getProofLen(address: string): Promise<number> {
        return Number((await this.getTraderAction(address)).proofsCount)
    }

    public async getPrevBalanceHash(address: string, index: number): Promise<string> {
        const proof = await this.getPeriodProofs(address, index)

        return proof.newBalanceHash
    }

    public async addPeriodProof(witnessProof: WitnessProofRequestInterface, prices: bigint[]): Promise<void> {
        await this.addProofAction({
            pi_a: [(new BN(witnessProof.pi_a[0])).toBuffer(), (new BN(witnessProof.pi_a[1])).toBuffer()],
            pi_b: [
                [(new BN(witnessProof.pi_b[0][0])).toBuffer(), (new BN(witnessProof.pi_b[0][1])).toBuffer()],
                [(new BN(witnessProof.pi_b[1][0])).toBuffer(), (new BN(witnessProof.pi_b[1][1])).toBuffer()]
            ],
            pi_c: [(new BN(witnessProof.pi_c[0])).toBuffer(), (new BN(witnessProof.pi_c[1])).toBuffer()],
            pnl: Number(witnessProof.publicSignals[1]),
            blockNumber: BigInt(0),
            newBalanceHash: (new BN(witnessProof.publicSignals[0])).toBuffer(),
            prices: prices
        })
    }

    public async getTradersCount(): Promise<number> {
        return (await this.listTradersAction()).length
    }

    public async getTrader(index: number|null): Promise<TraderResponseInterface> {
        let address = this.myPK.toString()
        if (index !== null) {
            address = (await this.listTradersAction())[index].toString()
        }

        const trader = (await this.getTraderAction(address))

        return {
            address: address,
            email: trader.email,
            signalsCount: Number(trader.signalsCount),
            proofsCount: Number(trader.proofsCount),
            creationBlockNumber: trader.creationBlockNumber,
        }
    }

    public async getEmail(address: string): Promise<string> {
        return (await this.getTraderAction(address)).email
    }

    public async getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        const proof = (await this.getProofsFromPageAction(address, BigInt(Math.floor(index / 10)))).map(
            (proof: Proof) => {
                return {
                    y: proof.pnl,
                    newBalanceHash: (new BN(proof.newBalanceHash)).toString(),
                    blockNumber: proof.blockNumber,
                    proof: {
                        pi_a: proof.pi_a.map(x => (new BN(x)).toString()),
                        pi_b: proof.pi_b.map(x => x.map(y => (new BN(y)).toString())),
                        pi_c: proof.pi_c.map(x => (new BN(x)).toString()),
                    },
                    prices: proof.prices,
                }
            }
        )

        return proof[index % 10] 
    }

    public async getPeriodProofsPage(address: string, page: number): Promise<PeriodProofResponseInterface[]> {
        return (await this.getProofsFromPageAction(address, BigInt(page))).map(
            (proof: Proof) => {
                return {
                    y: proof.pnl,
                    newBalanceHash: (new BN(proof.newBalanceHash)).toString(),
                    blockNumber: proof.blockNumber,
                    proof: {
                        pi_a: proof.pi_a.map(x => (new BN(x)).toString()),
                        pi_b: proof.pi_b.map(x => x.map(y => (new BN(y)).toString())),
                        pi_c: proof.pi_c.map(x => (new BN(x)).toString()),
                    },
                    prices: proof.prices,
                }
            }
        )
    }

    public async getTimestampByBlockNumber(blockNumber: bigint): Promise<number> {
        return this.getTimestampAction(blockNumber)
    }
}