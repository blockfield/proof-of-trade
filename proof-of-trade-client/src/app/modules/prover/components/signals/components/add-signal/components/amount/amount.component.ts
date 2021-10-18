import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import MathHelper from 'src/app/core/helpers/math.helper';
import { BalanceModel } from 'src/app/modules/prover/models/balance.model';
import { SignalModel } from 'src/app/modules/prover/models/signal.model';
import { PriceService } from 'src/app/modules/shared/services/price.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.less']
})
export class AmountComponent implements OnInit {
  @Input() public signal: SignalModel
  @Input() public balance: BalanceModel
  @Output() ready = new EventEmitter();
  @Output() back = new EventEmitter();

  public amount: string

  constructor(
    private priceService: PriceService,
    private toastr: ToastService,
  ) { }

  ngOnInit(): void {
  }

  public enterAmount(): void {
    const amount = MathHelper.decimalDigitsNumber(+this.amount.replace(' ', ''))

    if (!this.isBalanceEnoughAtMoment(amount)) {
      this.toastr.error('Not enough balance for this action')
      return
    }

    this.signal.amount = amount

    this.ready.emit()
  }

  public backClick(): void {
    this.back.emit()
  }

  public isBalanceEnoughAtMoment(amount: number): boolean {
    if (this.signal.action === SignalActionEnum.Buy) {
      return amount * MathHelper.removeDecimalDigitsNumber(this.priceService.getBtcPriceValue()) <= this.balance.usd
    } else if (this.signal.action === SignalActionEnum.Sell) {
      return amount <= this.balance.btc
    }

    throw new Error('Unknown action - select "Buy" or "Sell"')
  }

}
