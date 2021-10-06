import { Injectable } from '@angular/core';
import { SignalModel } from '../models/signal.model';
import { ProverModule } from '../prover.module';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  constructor() { }

  public hash(signal: SignalModel): string {
    return (window as any).signalHash(
      signal.action.valueOf(),
      signal.amount,
      signal.nonce
    )
  }
}
