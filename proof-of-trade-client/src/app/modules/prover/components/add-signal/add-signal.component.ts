import { Component, OnInit } from '@angular/core';
import { currencies, currenciesText, CurrencyEnum } from 'src/app/core/enums/currency.enum';
import { actions, actionsText, SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import { SignalModel } from '../../models/signal.model';
import { SignalService } from '../../services/signal.service';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-add-signal',
  templateUrl: './add-signal.component.html',
  styleUrls: ['./add-signal.component.less']
})
export class AddSignalComponent implements OnInit {
  public currencies: CurrencyEnum[] = currencies
  public currenciesText = currenciesText
  public actions: SignalActionEnum[] = actions
  public actionsText = actionsText

  public signal: SignalModel = new SignalModel(this.currencies[0])

  constructor(
    private traderService: TraderService,
    private signalService: SignalService,
  ) { }

  ngOnInit(): void {
  }

  public selectCurrency(selectedCurrency: CurrencyEnum): void {
    this.signal.currency = selectedCurrency
  }

  public setAction(action: SignalActionEnum): void {
    this.signal.setAction(action)
  }

  public sendSignal(): void {
    if (!this.signal.currency || !this.signal.amount || !this.signal.nonce) {
      console.log('empty signal data')
      return
    }

    const hash = this.signalService.hash(this.signal)

    this.traderService.addSignal(hash).subscribe(
      () => {
        console.log('signal is added')
      },
      (error: any) => {
        console.log('error on signal added: ', error)
      }
    )
  }

}
