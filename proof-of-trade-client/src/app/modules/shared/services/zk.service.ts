import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import SharedConsts from 'src/app/core/consts/shared-consts';
import MathHelper from 'src/app/core/helpers/math.helper';
import { SmartContractInterface } from '../interfaces/smart-contract.interface';
import { ProofModel } from '../models/proof.model';
import { WitnessProveModel } from '../models/witness-prove';
import { WitnessVerifyModel } from '../models/witness-verify';
import { AssetsService } from './assets.service';
import { PriceService } from './price.service';
import { WalletService } from './wallet.service';
import { WitnessService } from './witness.service';

@Injectable({
  providedIn: 'root'
})
export class ZkService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private priceService: PriceService,
    private walletService: WalletService,
    private witnessService: WitnessService,
    private assetsService: AssetsService,
  ) { }

  public prove(proofModel: ProofModel): Observable<void> {
    return from(this.internalProve(proofModel))
  }

  private async internalProve(proofModel: ProofModel): Promise<void> {
    const address = this.walletService.getAddress()
    
    const len = await this.contract.getTradeLen()
    const a = await this.contract.getSignal(address, len - 2)
    const b = await this.contract.getSignal(address, len - 1)

    const price_a = MathHelper.floorNumber(proofModel.proofs[0].price)
    const price_b = MathHelper.floorNumber(proofModel.proofs[1].price)
    const price_now = MathHelper.removeDecimalDigitsNumber(this.priceService.getBtcPriceValue())

    const proofLen = await this.contract.getProofLen(address)

    let previousBalanceHash = '639470893622803446635721399483204517617715645899470263648676575355455357367'
    if (proofLen !== 0) {
        previousBalanceHash = await this.contract.getPrevBalanceHash(address, proofLen - 1)
    }

    let input = new WitnessProveModel(
      [proofModel.proofs[0].action, proofModel.proofs[1].action],
      [proofModel.proofs[0].amount, proofModel.proofs[1].amount],
      [proofModel.proofs[0].nonce, proofModel.proofs[1].nonce],
      [proofModel.usdBalance, proofModel.btcBalance],
      previousBalanceHash,
      [a.hash, b.hash],
      [MathHelper.removeDecimalDigitsNumber(price_a), MathHelper.removeDecimalDigitsNumber(price_b), price_now]
    )

    const proof = await this.witnessService.prove(input)
    
    await this.contract.addPeriodProof(proof, [ MathHelper.numberToBigInt(price_now) ])
  }

  public verify(address: string, proofId: number): Observable<boolean> {
      return from(this.internalVerify(address, proofId))
  }

  public verifyAll(address: string, proofIds: number[]): Observable<boolean> {
    return from(this.internalVerifyAll(address, proofIds))
  }

  private async internalVerifyAll(address: string, proofIds: number[]): Promise<boolean> {
    let isTraderSuccess: boolean = true

    for (const proofId of proofIds) {
      let isProofSuccess = await this.internalVerify(address, proofId)

      isTraderSuccess = isTraderSuccess && isProofSuccess
    }

    return new Promise((resolve) => {
      resolve(isTraderSuccess)
    })
  }

  private async internalVerify(address: string, proofId: number): Promise<boolean> {
    const periodProof = await this.contract.getPeriodProofs(address, proofId)

    const a = await this.contract.getSignal(address, 2 * proofId)
    const b = await this.contract.getSignal(address, 2 * proofId + 1)

    const price_a = MathHelper.bigIntToFloorNumber(a.price)
    const price_b = MathHelper.bigIntToFloorNumber(b.price)
    const price_now = MathHelper.bigIntToFloorNumber(periodProof.prices[0])
    
    let previousBalanceHash = '639470893622803446635721399483204517617715645899470263648676575355455357367'
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
