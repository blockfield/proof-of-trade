import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { currencies, currenciesText, CurrencyEnum } from 'src/app/core/enums/currency.enum';
import { SignalModel } from 'src/app/modules/prover/models/signal.model';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.less']
})
export class CurrencyComponent implements OnInit {
  @Input() public signal: SignalModel
  @Output() ready = new EventEmitter();
  @Output() back = new EventEmitter();

  public currencies: CurrencyEnum[] = currencies
  public currenciesText = currenciesText

  constructor() { }

  ngOnInit(): void {
  }

  public selectCurrency(selectedCurrency: CurrencyEnum): void {
    this.signal.currency = selectedCurrency
    this.ready.emit()
  }

  public backClick(): void {
    this.back.emit()
  }

}
