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
    private tradersSeed = 'traders_list'
    private traderSeed = 'trader'
    private signalSeed = 'signal_1'
    private proofSeed = 'proof_1'

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
                /* todo change pubkey! */ {pubkey : traderPK, isSigner : false, isWritable : true},
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

    public async addSignal(hash: string): Promise<void> {
        let [traderPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ this.myPK.toBuffer(), Buffer.from(this.signalSeed)],
            this.programId
        );

        let bMethodId = Buffer.from([ 1 ], null, 32);
        let bBLockNumber = Buffer.from(Array(8).fill(0));
        let bHash = Buffer.from(hash, null, 32);

        // todo Move out to instruction builder
        const instructionLength = 41
        let instructionData = Buffer.concat([
                bMethodId,
                bBLockNumber,
                bHash
            ],
            instructionLength
        )

        const instruction = new solanaWeb3.TransactionInstruction({
            keys : [
                {pubkey : this.myPK, isSigner : true, isWritable : false},
                {pubkey : traderPK, isSigner : false, isWritable : true},
                /* todo change pubkey! */ {pubkey : traderPK, isSigner : false, isWritable : true},
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

        const signalAddedSignature = await this.connection.sendRawTransaction(signedTransaction.serialize());

        await this.connection.confirmTransaction(signalAddedSignature);
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

    public async addPeriodProof(witnessProof: WitnessProofRequestInterface, currentBlock: number): Promise<void> {
        let [traderPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ this.myPK.toBuffer(), Buffer.from(this.proofSeed)],
            this.programId
        );

        let bMethodId = Buffer.from([ 2 ], null, 32);
        let bPiA0 = Buffer.from(witnessProof.pi_a[0], null, 32);
        let bPiA1 = Buffer.from(witnessProof.pi_a[1], null, 32);
        let bPiB00 = Buffer.from(witnessProof.pi_b[0][0], null, 32);
        let bPiB01 = Buffer.from(witnessProof.pi_b[0][1], null, 32);
        let bPiB10 = Buffer.from(witnessProof.pi_b[1][0], null, 32);
        let bPiB11 = Buffer.from(witnessProof.pi_b[1][1], null, 32);
        let bPiC0 = Buffer.from(witnessProof.pi_c[0], null, 32);
        let bPiC1 = Buffer.from(witnessProof.pi_c[1], null, 32);
        let bPnl = Buffer.from(Array(4).fill(0));
        let bBLockNumber = Buffer.from(Array(8).fill(0));
        let bHash = Buffer.from(Array(32).fill(0));

        // todo Move out to instruction builder
        const instructionLength = 301
        let instructionData = Buffer.concat([
                bMethodId,
                bPiA0, bPiA1,
                bPiB00, bPiB01, bPiB10, bPiB11,
                bPiC0, bPiC1,
                bPnl, bBLockNumber, bHash
            ],
            instructionLength
        )

        const instruction = new solanaWeb3.TransactionInstruction({
            keys : [
                {pubkey : this.myPK, isSigner : true, isWritable : false},
                {pubkey : traderPK, isSigner : false, isWritable : true},
                /* todo change pubkey! */ {pubkey : traderPK, isSigner : false, isWritable : true},
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

        const signalAddedSignature = await this.connection.sendRawTransaction(signedTransaction.serialize());

        await this.connection.confirmTransaction(signalAddedSignature);
    }

    currentAnswer(blockNumber: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getBlockNumber(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public async getTradersCount(): Promise<number> {
        let [tradersPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ Buffer.from(this.tradersSeed)],
            this.programId
        );

        const accountInfo = await this.connection.getAccountInfo(tradersPK, this.commitment)

        return accountInfo.data.byteLength / 32 /* todo detect none-zero values? */
    }

    public async getTrader(index: number): Promise<string> {
        let [traderPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ Buffer.from(this.traderSeed)],
            this.programId
        );
        const accountInfo = await this.connection.getAccountInfo(traderPK, this.commitment)

        return accountInfo.data.buffer[0] /* todo get email from bytes! */
    }

    public async getEmail(address: string): Promise<string> {
        let [traderPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ Buffer.from(this.traderSeed)],
            new solanaWeb3.PublicKey(address)
        );
        const accountInfo = await this.connection.getAccountInfo(traderPK, this.commitment)

        return accountInfo.data.buffer[0] /* todo get email from bytes! */
    }

    getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        throw new Error("Method not implemented.");
    }
}