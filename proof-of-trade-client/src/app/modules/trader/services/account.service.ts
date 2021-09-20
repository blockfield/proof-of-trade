import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Contract } from 'src/app/api/ethereum/contract';
import { ContractInterface } from 'src/app/api/interfaces/contract.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private contract: ContractInterface = new Contract()

  constructor() { }

  public addTrader(email: string): Observable<void> {
    try {
      this.contract.newTrader(email)
    } catch(error: any) {
      return throwError(error)
    }

    return of()
  }
}
