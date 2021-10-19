import * as solanaWeb3 from '@solana/web3.js';

export class SolanaWeb3Contract {
    private programId = new solanaWeb3.PublicKey('FrNTo1X3gJDff9kqrWL1UzjKSn6NQNsg7TtSWkvgMk43')
    private btcPricePK = new solanaWeb3.PublicKey('HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J')
    private rpcEndpoint = 'https://api.devnet.solana.com'
    private commitment: solanaWeb3.Commitment = 'confirmed'

    private connection: solanaWeb3.Connection
    public myPK: solanaWeb3.PublicKey
    private provider: any

    constructor(address: string) {
        this.connection = new solanaWeb3.Connection(this.rpcEndpoint, this.commitment)
        this.myPK = address ? new solanaWeb3.PublicKey(address) : new solanaWeb3.PublicKey('3m6xAFV5qTZg92Gt1RmdGjDfRuhjc2pbojpTnH45Ffo3') // temporary default for user
        this.provider = (window as any).solana
    }

    private async getTraderPda(payerPk: solanaWeb3.PublicKey): Promise<solanaWeb3.PublicKey> {
        let [traderPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ payerPk.toBuffer(), Buffer.from('trader') ],
            this.programId
        );

        return traderPK
    }

    private async getSignalPda(traderPK: solanaWeb3.PublicKey, pageNumber: bigint): Promise<solanaWeb3.PublicKey> {
        let pageNumberBytes = Buffer.alloc(8)
        pageNumberBytes.writeBigUInt64BE(pageNumber)

        const [signalPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ traderPK.toBuffer(), Buffer.from("signals_page_"), pageNumberBytes ],
            this.programId
        )

        return signalPK
    }

    private async getProofPda(traderPK: solanaWeb3.PublicKey, pageNumber: bigint): Promise<solanaWeb3.PublicKey> {
        let pageNumberBytes = Buffer.alloc(8)
        pageNumberBytes.writeBigUInt64BE(BigInt(pageNumber))

        const [proofPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ traderPK.toBuffer(), Buffer.from("proofs_page_"), pageNumberBytes ],
            this.programId
        )

        return proofPK
    }

    private async getTradersPda(): Promise<solanaWeb3.PublicKey> {
        const [tradersPK, _] = await solanaWeb3.PublicKey.findProgramAddress(
            [ Buffer.from("traders_list") ],
            this.programId
        )

        return tradersPK
    }

    /*
        CreateTraderInstruction
        +----------------------------+
        | - [1] (byte) method_id     |
        | - [64] (byte array) email  |
        |----------------------------|
        | Total size: 65 bytes       |
        +----------------------------+
    */
    public async createTraderAction(email: String) {

        const traderPK = await this.getTraderPda(this.myPK)
        const tradersPK = await this.getTradersPda()

        let bMethodId = Buffer.from([ 0 ])
        let bEmail = Buffer.from(email)

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
                {pubkey : tradersPK, isSigner : false, isWritable : true},
                {pubkey : solanaWeb3.SystemProgram.programId, isSigner : false, isWritable : false},
                {pubkey : solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner : false, isWritable : false},
                { pubkey: solanaWeb3.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false }
            ],
            programId: this.programId,
            data : instructionData,
        })

        // todo Move out to base method
        const recentBlock = await this.connection.getRecentBlockhash(this.commitment)

        const signedTransaction = await this.provider.signTransaction(
            new solanaWeb3.Transaction({
                recentBlockhash: recentBlock.blockhash,
                feePayer: this.myPK
            }).add(instruction)
        )

        const traderCreatedSignature = await this.connection.sendRawTransaction(signedTransaction.serialize())

        await this.connection.confirmTransaction(traderCreatedSignature)
    }
    
    /*
        Trader account data
        +------------------------------+
        | - [1] (bool) is_initialized  |
        | - [64] (byte array) email    |
        | - [8] (uint) signals counter |
        | - [8] (uint) proofs counter  |
        | - [8] (uint) block number    |
        |------------------------------+
        | Total size: 89 bytes         |
        +------------------------------+
    */
    public async getTraderAction(address: string): Promise<Trader> {
        const traderAddress = await this.getTraderPda(new solanaWeb3.PublicKey(address))
    
        const traderAccount = await this.connection.getAccountInfo(traderAddress);
        if (traderAccount === null || traderAccount.data[0] !== 1) {
            return {
                email: '',
                signalsCount: BigInt(0),
                proofsCount: BigInt(0),
                creationBlockNumber: BigInt(0),
            }
            // throw Error("trader account is not exists")
        }
    
        const bEmail = traderAccount.data.slice(1, 65)
        const bSignalsCount = traderAccount.data.slice(65, 73)
        const bProofsCount = traderAccount.data.slice(73, 81)
        const bBlockNumber = traderAccount.data.slice(81, 89)

        return {
            email: bEmail.slice(bEmail.lastIndexOf(0) + 1).toString(),
            signalsCount: bSignalsCount.readBigUInt64BE(),
            proofsCount: bProofsCount.readBigUInt64BE(),
            creationBlockNumber: bBlockNumber.readBigUInt64BE(),
        }
    }
    
    /*
        TradersList account data
        +------------------------------------+
        | - [8] (uint) counter               |
        | - [32 * 100] (uint) proofs counter |
        |------------------------------------+
        | Total size: 3208 bytes               |
        +------------------------------------+
    */
    public async listTradersAction(): Promise<solanaWeb3.PublicKey[]> {
        const tradersListAddress = await this.getTradersPda()
    
        const tradersListAccount = await this.connection.getAccountInfo(tradersListAddress)
        if (tradersListAccount === null) {
            throw Error("traders list account is not exists")
        }
    
        const bCount = tradersListAccount.data.slice(0, 8)
    
        const bTraders = tradersListAccount.data.slice(8)
    
        let traders: solanaWeb3.PublicKey[] = []
        for (let i = 0; i < bCount.readBigUInt64BE(); i++) {
            traders.push(
                new solanaWeb3.PublicKey(
                    bTraders.slice(i * 32, (i + 1) * 32)
                )
            )
        }
    
        return traders
    }
    
    /*
            Signal data
          +---------------------------------------+
          | - [1] (bool) is_initialized           |
          | - [8] (uint) block_number             |
          | - [32] (byte array) hash              |
          | - [8 * 10] [array of 10 uints] prices |
          |---------------------------------------+
       +->| Total size: 121 bytes                 |
       |  +---------------------------------------+
       |
       |       AddSignalInstruction
       |       +-------------------------+
       |       | - [1] (byte) method_id  |
       +-------| - [121] (signal) signal |
               |-------------------------|
               | Total size: 122 bytes   |
               +-------------------------+
    */
    public async addSignalAction(signal: Signal): Promise<void> {
        let traderAddress = await this.getTraderPda(this.myPK)
        let traderAccount = await this.getTraderAction(this.myPK.toString())
        let signalsPageAddress = await this.getSignalPda(this.myPK, traderAccount.signalsCount / BigInt(10))
    
        let bSignalData = Buffer.alloc(121)
    
        Buffer.from([1]).copy(bSignalData)
        bSignalData.writeBigUInt64BE(BigInt(signal.blockNumber), 1)
        signal.hash.copy(bSignalData, 9)
    
        let instructionData = Buffer.alloc(122)
        let bMethodId = Buffer.from([1])
        bMethodId.copy(instructionData)
        bSignalData.copy(instructionData, 1)
    
        const instruction = new solanaWeb3.TransactionInstruction({
            keys: [
                { pubkey: this.myPK, isSigner: true, isWritable: false },
                { pubkey: traderAddress, isSigner: false, isWritable: true },
                { pubkey: signalsPageAddress, isSigner: false, isWritable: true },
                { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false },
                { pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: solanaWeb3.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: this.btcPricePK, isSigner: false, isWritable: false }
            ],
            programId: this.programId,
            data: instructionData,
        })

        // todo Move out to base method
        const recentBlock = await this.connection.getRecentBlockhash(this.commitment)

        const signedTransaction = await this.provider.signTransaction(
            new solanaWeb3.Transaction({
                recentBlockhash: recentBlock.blockhash,
                feePayer: this.myPK
            }).add(instruction)
        )

        const signalAddedSignature = await this.connection.sendRawTransaction(signedTransaction.serialize())

        await this.connection.confirmTransaction(signalAddedSignature)
    }
    /*
        Signals page
        +------------------------------------------+
        | - [121 * 10] (array of signals) signals  |
        |------------------------------------------+
        | Total size: 1210 bytes                    |
        +------------------------------------------+
    */
    public async getSignalsFromPageAction(address: string, pageNumber: bigint): Promise<Signal[]> {
        const signalsPageAddress = await this.getSignalPda(new solanaWeb3.PublicKey(address), pageNumber)
    
        const signalsPageAccount = await this.connection.getAccountInfo(signalsPageAddress)
        if (signalsPageAccount === null || signalsPageAccount.data.length === 0) {
            throw Error("signals page account is not exists")
        }
    
        let signals: Signal[] = []
        for (let i = 0; i < 10; i++) {
            let signalData = signalsPageAccount.data.slice(i * 121, (i + 1) * 121)
    
            if (signalData[0] != 1) {
                break
            }

            let blockNumber = signalData.slice(1, 9).readBigUInt64BE()
            let hash = signalData.slice(9, 41)
    
            var prices: bigint[] = []
            let bPrices = signalData.slice(41, 121)
            for (let j = 0; j < 10; j++) {
                prices.push(
                    bPrices.slice(j * 8, (j + 1) * 8).readBigUInt64BE()
                )
            }
    
            signals.push({
                blockNumber: blockNumber,
                hash: hash,
                prices: prices,
            })
        }
    
        return signals
    }
    
    /*
          Proof data
          +---------------------------------------+
          | - [1] (bool) is_initialized           |
          | - [32 * 2] (2 byte arrays) pi_a       |
          | - [32 * 2 * 2] (2x2 byte arrays) pi_b |
          | - [32 * 2] (2 byte arrays) pi_c       |
          | - [4] (uint32) pnl                    |
          | - [8] (uint) block_number             |
          | - [32] (byte array) new_balance_hash  |
          | - [8 * 10] [array of 10 uints] prices |
          |---------------------------------------+
       +->| Total size: 381 bytes                 |
       |  +---------------------------------------+
       |
       |       AddProofInstruction
       |       +-------------------------+
       |       | - [1] (byte) method_id  |
       +-------| - [381] (proof) proof   |
               |-------------------------|
               | Total size: 382 bytes   |
               +-------------------------+
    */
    public async addProofAction(proof: Proof): Promise<void> {
        const traderAddress = await this.getTraderPda(this.myPK)
        const traderAccount = await this.getTraderAction(this.myPK.toString())
        const proofsPageAddress = await this.getProofPda(this.myPK, traderAccount.proofsCount / BigInt(10))
    
        let proofData = Buffer.alloc(382)
    
        Buffer.from([1]).copy(proofData)
    
        proof.pi_a[0].copy(proofData, 1)
        proof.pi_a[1].copy(proofData, 33)
    
        proof.pi_b[0][0].copy(proofData, 65)
        proof.pi_b[0][1].copy(proofData, 97)
        proof.pi_b[1][0].copy(proofData, 129)
        proof.pi_b[1][1].copy(proofData, 161)
    
        proof.pi_c[0].copy(proofData, 193)
        proof.pi_c[1].copy(proofData, 225)
    
        proofData.writeUInt32BE(proof.pnl, 257)
    
        proofData.writeBigUInt64BE(BigInt(proof.blockNumber), 261)
    
        proof.newBalanceHash.copy(proofData, 269)

        for (let i = 0; i < 10; i++) {
            let price = i < proof.prices.length ? proof.prices[i] : BigInt(0)
            proofData.writeBigUInt64BE(price, 301 + i * 8)
        }
    
        let bInstructionData = Buffer.alloc(382)
        let bMethodId = Buffer.from([2])

        bMethodId.copy(bInstructionData)
        proofData.copy(bInstructionData, 1)
    
        const instruction = new solanaWeb3.TransactionInstruction({
            keys: [
                { pubkey: this.myPK, isSigner: true, isWritable: false },
                { pubkey: traderAddress, isSigner: false, isWritable: true },
                { pubkey: proofsPageAddress, isSigner: false, isWritable: true },
                { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false },
                { pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: solanaWeb3.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: this.btcPricePK, isSigner: false, isWritable: false },
            ],
            programId: this.programId,
            data: bInstructionData,
        })

        // todo Move out to base method
        const recentBlock = await this.connection.getRecentBlockhash(this.commitment)

        const signedTransaction = await this.provider.signTransaction(
            new solanaWeb3.Transaction({
                recentBlockhash: recentBlock.blockhash,
                feePayer: this.myPK
            }).add(instruction)
        )

        const proofAddedSignature = await this.connection.sendRawTransaction(signedTransaction.serialize())

        await this.connection.confirmTransaction(proofAddedSignature)
    }
    
    /*
        Proofs page
        +------------------------------------------+
        | - [301 * 10] (array of proofs) proofs  |
        |------------------------------------------+
        | Total size: 3010 bytes                    |
        +------------------------------------------+
    */
    public async getProofsFromPageAction(address: string, pageNumber: bigint): Promise<Proof[]> {
        const proofsPageAddress = await this.getProofPda(new solanaWeb3.PublicKey(address), pageNumber)
    
        const proofsPageAccount = await this.connection.getAccountInfo(proofsPageAddress)
        if (proofsPageAccount === null || proofsPageAccount.data.length === 0) {
            return []
        }
    
        let proofs: Proof[] = []
        for (let i = 0; i < 10; i++) {
            const proofData = proofsPageAccount.data.slice(i * 381, (i + 1) * 381)
    
            if (proofData[0] != 1) {
                break
            }
    
            var prices: bigint[] = []
            let bPrices = proofData.slice(301, 381)
            for (let i = 0; i < 10; i++) {
                prices.push(
                    bPrices.slice(i * 8, (i + 1) * 8).readBigUInt64BE()
                )
            }
    
            let proof: Proof = {
                pi_a: [proofData.slice(1, 33), proofData.slice(33, 65)],
                pi_b: [
                    [proofData.slice(65, 97), proofData.slice(97, 129)],
                    [proofData.slice(129, 161), proofData.slice(161, 193)],
                ],
                pi_c: [proofData.slice(193, 225), proofData.slice(225, 257)],
                pnl: proofData.slice(257, 261).readUInt32BE(0),
                blockNumber: proofData.slice(261, 269).readBigUInt64BE(),
                newBalanceHash: proofData.slice(269, 301),
                prices: prices
            }
    
            proofs.push(proof)
        }
    
        return proofs
    }

    public async getTimestampAction(blockNumber: bigint): Promise<number> {
        if (blockNumber < 1000) {
            return 0
        }
        
        const blockTimestamp = await this.connection.getBlockTime(Number(blockNumber))

        return blockTimestamp * 1000
    }
}

export interface Trader {
    email: string,
    signalsCount: bigint,
    proofsCount: bigint,
    creationBlockNumber: bigint,
}

export interface Signal {
    blockNumber: bigint,
    hash: Buffer,
    prices: bigint[],
}

export interface Proof {
    pi_a: [Buffer, Buffer],
    pi_b: [[Buffer, Buffer], [Buffer, Buffer]],
    pi_c: [Buffer, Buffer],
    pnl: number,
    blockNumber: bigint,
    newBalanceHash: Buffer,
    prices: bigint[],
}