import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private btcPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  constructor() { }

  public subscribeToBtcPrice(): void {
    this.btcPrice$.subscribe()
  }

  public nextBtcPrice(price: number): void {
    this.btcPrice$.next(price)
  }

  public getBtcPrice(): Observable<number> {
    return this.btcPrice$
  }

  public getBtcPriceValue(): number {
    return this.btcPrice$.getValue()
  }
}
