import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { ZkService } from '../../shared/services/zk.service';
import { ProofModel } from '../models/proof.model';
import { ProverModule } from '../prover.module';

@Injectable({
  providedIn: 'root'
})
export class TraderService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private zkService: ZkService
  ) { }

  public addTrader(email: string): Observable<void> {
    return from(this.contract.newTrader(email))
  }

  public addSignal(hash: string): Observable<void> {
    return from(this.contract.addSignal(hash))
  }

  public addPeriodProof(model: ProofModel): Observable<void> {
    return from(this.zkService.prove(model.toZkProofModel()))
  }
}
