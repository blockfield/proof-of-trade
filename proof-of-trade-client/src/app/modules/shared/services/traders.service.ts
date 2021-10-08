import { Inject, Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { VerificationProverEnum } from 'src/app/core/enums/verification-trader.enum';
import { SmartContractInterface } from '../interfaces/smart-contract.interface';
import { TraderModel } from '../models/trader.model';
import { StrategyModel } from '../../verifier/models/strategy.model';
import { ProofItem } from '../models/proof-item';

@Injectable({
  providedIn: 'root'
})
export class TradersService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
  ) {}

  public getTrader(index: number): Observable<TraderModel> {
    return from(this.getTraderModel(index))
  }

  public async getTraderModel(index: number): Promise<TraderModel> {
    const address = await this.contract.getTrader(index)
    const email = await this.contract.getEmail(address)
    const proofLen = await this.contract.getProofLen(address)

    const createdDate = new Date(2021, 7, 1, 15, 0, 0)
    const initBalance = 1000

    let proof: ProofItem[] = []
    for (let j = 0; j < proofLen; j++) {
      let balance = (await this.contract.getPeriodProofs(address, j)).y

      let prevProofBalance = initBalance
      if (j !== 0) {
        prevProofBalance = (await this.contract.getPeriodProofs(address, j-1)).y
      }

      proof.push(new ProofItem(j, balance, prevProofBalance))
    }

    return new TraderModel(index, email, address, proof, createdDate)
  }

  public getTraders(): Observable<StrategyModel> {
    let tradersSubject = new Subject<StrategyModel>();

    (async () => await this.nextTrader(tradersSubject))()

    return tradersSubject
  }

  private async nextTrader(tradersSubject: Subject<StrategyModel>): Promise<void> {
    const now = new Date()
    const tradersCount = await this.contract.getTradersCount()

    for (let i = 0; i < tradersCount; i++) {
      const traderModel = await this.getTraderModel(i)

      const createdDate = new Date(2021, 7, 1, 15, 0, 0)
      const initBalance = 1000

      let profitSum = 0
      let proofCount = 0
      let proofIds = []
      for (let j = 0; j < traderModel.proof.length; j++) {
        profitSum += (traderModel.proof[j].balance - traderModel.proof[j].prevBalance)
        proofCount++
        proofIds.push(j)
      }

      const monthDiffForAvg = this.monthDiff(createdDate, now) ?? 1
      const avgProfitPerMonth = 100 * (profitSum / initBalance) / monthDiffForAvg
      const avgProofCountPerMonth = proofCount / monthDiffForAvg

      tradersSubject.next(new StrategyModel(
          i, traderModel.email, traderModel.address, proofIds,
          avgProfitPerMonth, avgProofCountPerMonth,
          VerificationProverEnum.Unverified, createdDate
        )
      )
    }

    tradersSubject.complete()
  }

  private monthDiff(from: Date, to: Date) {
    var months;
    months = (to.getFullYear() - from.getFullYear()) * 12;
    months -= from.getMonth();
    months += to.getMonth();
    return months <= 0 ? 0 : months;
  }
}
