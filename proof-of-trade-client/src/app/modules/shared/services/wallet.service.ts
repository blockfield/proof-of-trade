import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { asapScheduler, BehaviorSubject, from, Observable, scheduled } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { WalletProviderInterface } from '../interfaces/wallet-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  public address$: BehaviorSubject<string|null> = new BehaviorSubject(null)

  constructor(
    @Inject('WalletProviderInterface') private walletProvider: WalletProviderInterface
  ) {}

  public connect(): Observable<string> {
    if (!!this.address$.getValue()) {
      return scheduled([this.address$.getValue()], asapScheduler)
    }

    return from(this.walletProvider.connect())
      .pipe(
        filter((address: string|null) => !!address),
        tap((address: string) => {
          this.address$.next(address)
        }),
      )
  }

  public getAddress(): string {
    if (!this.address$.getValue()) {
      return ''
    }

    return this.address$.getValue()
  }
}
