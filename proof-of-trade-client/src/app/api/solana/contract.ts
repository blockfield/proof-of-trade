import { Injectable } from "@angular/core";
import * as solanaWeb3 from '@solana/web3.js';
import { PeriodProofResponseInterface, SignalResponseInterface, SmartContractInterface, WitnessProofRequestInterface } from "src/app/modules/shared/interfaces/smart-contract.interface";
import { WalletService } from "src/app/modules/shared/services/wallet.service";

@Injectable({
    providedIn: 'root'
})
export class Contract implements SmartContractInterface {
    private programId = new solanaWeb3.PublicKey('9mgarPvbWJrMghTVAk8E9bAC5vpXPyhEFGAubBKsiko6')
    private rpcEndpoint = 'https://api.testnet.solana.com'
    private commitment: solanaWeb3.Commitment = 'confirmed'
    private traderSeed = 'trader'

    private connection: solanaWeb3.Connection
    private myPK: solanaWeb3.PublicKey
    private provider: any

    constructor(walletService: WalletService) {
        this.connection = new solanaWeb3.Connection(this.rpcEndpoint, this.commitment)
        this.myPK = new solanaWeb3.PublicKey(walletService.getAddress())
        this.provider = (window as any).solana
    }

    public async newTrader(email: string): Promise<void> {
        let [traderPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ this.myPK.toBuffer(), Buffer.from(this.traderSeed)],
            this.programId
        );

        let bMethodId = Buffer.from([ 0 ]);
        let bEmail = Buffer.from(email);

        // todo Move out to instruction builder
        const instructionLength = 65
        let instructionData = Buffer.concat([
                bMethodId,
                Buffer.alloc(instructionLength - bMethodId.length - bEmail.length),
                bEmail
            ],
            instructionLength
        )

        const instruction = new solanaWeb3.TransactionInstruction({
            keys : [
                {pubkey : this.myPK, isSigner : true, isWritable : false},
                {pubkey : traderPK, isSigner : false, isWritable : true},
                {pubkey : solanaWeb3.SystemProgram.programId, isSigner : false, isWritable : false},
                {pubkey : solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner : false, isWritable : false}
            ],
            programId: this.programId,
            data : instructionData,
        });

        // todo Move out to base method
        const recentBlock = await this.connection.getRecentBlockhash(this.commitment)

        const signedTransaction = await this.provider.signTransaction(
            new solanaWeb3.Transaction({
                recentBlockhash: recentBlock.blockhash,
                feePayer: this.myPK
            }).add(instruction)
        );

        const traderCreatedSignature = await this.connection.sendRawTransaction(signedTransaction.serialize());

        await this.connection.confirmTransaction(traderCreatedSignature);
    }

    addSignal(hash: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getTradeLen(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getSignal(address: string, index: number): Promise<SignalResponseInterface> {
        throw new Error("Method not implemented.");
    }

    getProofLen(address: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getPrevBalanceHash(address: string, index: number): Promise<string> {
        throw new Error("Method not implemented.");
    }

    addPeriodProof(witnessProof: WitnessProofRequestInterface, currentBlock: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    currentAnswer(blockNumber: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getBlockNumber(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getTradersCount(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getTrader(index: number): Promise<string> {
        throw new Error("Method not implemented.");
    }

    getEmail(address: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        throw new Error("Method not implemented.");
    }
}