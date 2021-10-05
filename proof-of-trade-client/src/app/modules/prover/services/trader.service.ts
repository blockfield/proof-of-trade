import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { flatMap, mergeMap, tap } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { ZkService } from '../../shared/services/zk.service';
import { ProofModel } from '../models/proof.model';
import { SignalModel } from '../models/signal.model';

@Injectable({
  providedIn: 'root'
})
export class TraderService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private storageService: StorageService,
    private zkService: ZkService
  ) { }

  public addTrader(email: string): Observable<void> {
    return from(this.contract.newTrader(email))
  }

  public addSignal(signal: SignalModel, hash: string): Observable<void> {
    return from(this.contract.addSignal(hash))
      .pipe(
        // mergeMap(() => this.storageService.set('signal', signal))
      )
  }

  public addPeriodProof(model: ProofModel): Observable<void> {
    return from(this.zkService.prove(model.toZkProofModel()))
  }
}
