import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SmartContractInterface } from '../interfaces/smart-contract.interface';
import { ProofModel } from '../models/proof.model';
import { WitnessProveModel } from '../models/witness-prove';
import { WitnessProveResult } from '../models/witness-prove-result';
import { WitnessVerifyModel } from '../models/witness-verify';
import { AssetsService } from './assets.service';
import { WalletService } from './wallet.service';
import { WitnessService } from './witness.service';

@Injectable({
  providedIn: 'root'
})
export class ZkService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private walletService: WalletService,
    private witnessService: WitnessService,
    private assetsService: AssetsService
  ) { }

  public prove(proofModel: ProofModel): Observable<void> {
    return from(this.internalProve(proofModel))
  }

  private async internalProve(proofModel: ProofModel): Promise<void> {
    const address = this.walletService.getAddress()
    
    const len = await this.contract.getTradeLen()
    const a = await this.contract.getSignal(address, len - 2)
    const b = await this.contract.getSignal(address, len - 1)

    const currentBlock = await this.contract.getBlockNumber()

    const price_a = await this.contract.currentAnswer(a.blockNumber) / Math.pow(10, 8)
    const price_b = await this.contract.currentAnswer(b.blockNumber) / Math.pow(10, 8)
    const price_now = await this.contract.currentAnswer(currentBlock) / Math.pow(10, 8)

    const proofLen = await this.contract.getProofLen(address)

    let previousBalanceHash = '12991363837217894993991711342410433599666196004667524206273513024950584067662';
    if (proofLen !== 0) {
        previousBalanceHash = await this.contract.getPrevBalanceHash(address, proofLen - 1)
    }

    let input = new WitnessProveModel(
      [proofModel.proofs[0].action, proofModel.proofs[1].action],
      [proofModel.proofs[0].amount, proofModel.proofs[1].amount],
      [proofModel.proofs[0].nonce, proofModel.proofs[1].nonce],
      [proofModel.usdBalance, proofModel.ethBalance],
      previousBalanceHash,
      [a.hash, b.hash],
      [Math.round(price_a), Math.round(price_b), Math.round(price_now)]
    )

    const proof = await this.witnessService.prove(input)
    
    await this.contract.addPeriodProof(proof, currentBlock)
  }

  public verify(address: string, proofId: number): Observable<boolean> {
      return from(this.internalVerify(address, proofId))
  }

  private async internalVerify(address: string, proofId: number): Promise<boolean> {
    const periodProof = await this.contract.getPeriodProofs(address, proofId)

    const a = await this.contract.getSignal(address, 2 * proofId)
    const b = await this.contract.getSignal(address, 2 * proofId + 1)

    const price_a = Math.round((await this.contract.currentAnswer(a.blockNumber)) / Math.pow(10, 8))
    const price_b = Math.round((await this.contract.currentAnswer(b.blockNumber)) / Math.pow(10, 8))
    const price_now = Math.round((await this.contract.currentAnswer(periodProof.blockNumber)) / Math.pow(10, 8))
    
    let previousBalanceHash = '12991363837217894993991711342410433599666196004667524206273513024950584067662'
    if (proofId !== 0) {
        previousBalanceHash = (await this.contract.getPeriodProofs(address, proofId - 1)).newBalanceHash;
    }

    const witnessVerify = new WitnessVerifyModel(
      periodProof.newBalanceHash,
      periodProof.y,
      previousBalanceHash,
      [a.hash, b.hash],
      [price_a, price_b],
      price_now
    )

    return this.witnessService.verify(
      this.assetsService.getVerificationKey(),
      witnessVerify,
      periodProof.proof
    )
  }
}
