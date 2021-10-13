import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { currenciesText } from 'src/app/core/enums/currency.enum';
import { actionsText, SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import { SignalStateEnum } from 'src/app/core/enums/signal-state.enum';
import { BalanceModel } from 'src/app/modules/prover/models/balance.model';
import { SignalModel } from '../../../../models/signal.model';
import { SignalService } from '../../../../services/signal.service';
import { TraderService } from '../../../../services/trader.service';

@Component({
  selector: 'app-add-signal',
  templateUrl: './add-signal.component.html',
  styleUrls: ['./add-signal.component.less']
})
export class AddSignalComponent implements OnInit {
  @Output() signalAdded = new EventEmitter<SignalModel>()

  private stepCount = 5

  public actionsText = actionsText
  public currenciesText = currenciesText

  public signal: SignalModel = new SignalModel()
  public balance: BalanceModel
  public signalState: SignalStateEnum = SignalStateEnum.Undefined
  public addingStep: number = 0

  constructor(
    private toastr: ToastrService,
    private traderService: TraderService,
    private signalService: SignalService,
  ) { }

  ngOnInit(): void {
    this.initBalance()
  }

  private initBalance(): void {
    this.traderService.getMyStorageBalance().subscribe(
      (balance) => {
        this.balance = balance
      },
      (error: any) => {
        this.toastr.error('Something went wrong')
        console.log(error)
      }
    )
  }

  public onReady(): void {
    if (this.addingStep % this.stepCount === this.stepCount - 2) {
      this.signalState = SignalStateEnum.Adding
      this.sendSignal()
    }

    this.addingStep = (this.addingStep + 1) % this.stepCount
  }

  public sendSignal(): void {
    if (!this.signal.currency || !this.signal.amount || !this.signal.nonce) {
      this.toastr.error('Signal\'s data is empty')
      return
    }

    const hash = this.signalService.hash(this.signal)

    this.traderService.addSignal(this.signal, hash).subscribe(
      (newSignal: SignalModel) => {
        this.signalState = SignalStateEnum.Successed

        let usd = this.balance.usd
        let btc = this.balance.btc

        const usdDiff = Number(newSignal.amount) * Number(newSignal.price / 1000000000)
        const btcDiff = newSignal.amount

        if (newSignal.action === SignalActionEnum.Buy) {
          usd -= usdDiff
          btc += btcDiff
        } else if (newSignal.action === SignalActionEnum.Sell) {
          usd += usdDiff
          btc -= btcDiff
        }

        this.balance = new BalanceModel(usd, btc)

        this.signalAdded.emit(newSignal)
        this.signal.clear()
      },
      (error: any) => {
        this.toastr.error('Signal failed')
        console.log(error)
        this.signalState = SignalStateEnum.Failed
        this.signal.clear()
      }
    )
  }

}
