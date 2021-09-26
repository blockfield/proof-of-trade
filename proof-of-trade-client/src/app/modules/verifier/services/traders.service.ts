import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { ProofItem } from '../models/proof-item';
import { TraderModel } from '../models/trader.model';
import { VerifierModule } from '../verifier.module';

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
    const tradersCount = await this.contract.getTradersCount()

    for (let i = 0; i < tradersCount; i++) {
      const address = await this.contract.getTrader(i)
      const email = await this.contract.getEmail(address)
      const proofLen = await this.contract.getProofLen(address)

      let proofs: ProofItem[] = []
      for (let j = 0; j < proofLen; j++) {
        let balance = (await this.contract.getPeriodProofs(address, j)).y

        let prevProofBalance = 1000
        if (j !== 0) {
          prevProofBalance = (await this.contract.getPeriodProofs(address, j-1)).y
        }

        proofs.push(new ProofItem(j, balance, prevProofBalance))
      }

      tradersSubject.next(new TraderModel(i, email, address, proofs))
    }

    tradersSubject.complete()
  }
}
