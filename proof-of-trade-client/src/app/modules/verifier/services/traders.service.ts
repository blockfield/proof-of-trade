import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { VerificationTraderEnum } from 'src/app/core/enums/verification-trader.enum';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { ProofItem } from '../models/proof-item';
import { TraderModel } from '../models/trader.model';

@Injectable({
  providedIn: 'root'
})
export class TradersService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface
  ) {}

  public getTraders(): Observable<TraderModel> {
    let tradersSubject = new Subject<TraderModel>();

    (async () => await this.nextTrader(tradersSubject))()

    return tradersSubject
  }

  private async nextTrader(tradersSubject: Subject<TraderModel>): Promise<void> {
    const now = new Date()
    const tradersCount = await this.contract.getTradersCount()

    for (let i = 0; i < tradersCount; i++) {
      const address = await this.contract.getTrader(i)
      const email = await this.contract.getEmail(address)
      const proofLen = await this.contract.getProofLen(address)

      const createdDate = new Date(2021, 7, 1, 15, 0, 0)
      const initBalance = 1000

      let proof: ProofItem[] = []
      let profitSum = 0
      let proofCount = 0
      for (let j = 0; j < proofLen; j++) {
        let balance = (await this.contract.getPeriodProofs(address, j)).y

        let prevProofBalance = initBalance
        if (j !== 0) {
          prevProofBalance = (await this.contract.getPeriodProofs(address, j-1)).y
        }

        proof.push(new ProofItem(j, balance, prevProofBalance))

        profitSum += (balance - prevProofBalance)
        proofCount++
      }

      const monthDiffForAvg = this.monthDiff(createdDate, now) ?? 1
      const avgProfitPerMonth = 100 * (profitSum / initBalance) / monthDiffForAvg
      const avgProofCountPerMonth = proofCount / monthDiffForAvg

      tradersSubject.next(new TraderModel(
          i, email, address, proof,
          avgProfitPerMonth, avgProofCountPerMonth,
          VerificationTraderEnum.Unverified, createdDate
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
