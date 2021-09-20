import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Contract } from 'src/app/api/ethereum/contract';
import { ContractInterface } from 'src/app/api/interfaces/contract.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  private contract: ContractInterface = new Contract()

  constructor() { }

  public addSignal(hash: string): Observable<void> {
    try {
      this.contract.addSignal(hash)
    } catch(error: any) {
      return throwError(error)
    }

    return of()
  }
}
