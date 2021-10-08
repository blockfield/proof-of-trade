import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { WalletService } from '../../shared/services/wallet.service';
import { ZkService } from '../../shared/services/zk.service';
import { ProofItem } from '../models/proof-item';
import { ProofModel } from '../models/proof.model';
import { SignalModel } from '../models/signal.model';

@Injectable({
  providedIn: 'root'
})
export class TraderService {
  private signalsKey = 'signals'

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private storageService: StorageService,
    private walletService: WalletService,
    private zkService: ZkService
  ) { }

  public addTrader(email: string): Observable<void> {
    return from(this.contract.newTrader(email))
  }

  public getProofList(): Observable<ProofItem[]> {
    return from(this.getProof())
  }

  private async getProof(): Promise<ProofItem[]> {
    const address = this.walletService.getAddress()
    const proofLen = await this.contract.getProofLen(address)
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

    return proof
  }

  public addSignal(signal: SignalModel, hash: string): Observable<void> {
    return from(this.contract.addSignal(hash))
      .pipe(
        mergeMap(() => this.getSignals()),
        mergeMap((signals: SignalModel[]) => {
          signals.push(signal)

          return this.storageService.set(this.signalsKey, signals)
        })
      )
  }

  public getSignals(): Observable<SignalModel[]> {
    return this.storageService.get<any[]>(this.signalsKey).pipe(
      map(
        (signals: any[]) => {
          if (signals && signals.length > 0) {
            return signals.map(x => new SignalModel(x.currency, x.amount, x.nonce, x.action))
          }

          return []
        }
      )
    )
  }

  public addPeriodProof(model: ProofModel): Observable<void> {
    return from(this.zkService.prove(model.toZkProofModel()))
  }
}
