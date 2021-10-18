import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import SharedConsts from 'src/app/core/consts/shared-consts';

import { currenciesText } from 'src/app/core/enums/currency.enum';
import { actionsText, SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import { SignalStateEnum } from 'src/app/core/enums/signal-state.enum';
import { BalanceModel } from 'src/app/modules/prover/models/balance.model';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
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
  public maxDecimals = 10 ** SharedConsts.maxDecimalDigits

  public signal: SignalModel = new SignalModel()
  public balance: BalanceModel
  public signalState: SignalStateEnum = SignalStateEnum.Undefined
  public addingStep: number = 0

  constructor(
    private toastr: ToastService,
    private traderService: TraderService,
    private signalService: SignalService,
  ) { }

  ngOnInit(): void {
    this.initBalance()
  }

  private initBalance(): void {
    this.traderService.getMyStorageBalance().subscribe(
      (balances) => {
        this.balance = balances.slice(-1)[0]
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

  public onBack(): void {
    if (this.addingStep > 0 && this.addingStep < this.stepCount -1) {
      this.addingStep = (this.addingStep - 1) % this.stepCount
    }
  }

  public sendSignal(): void {
    if (!this.signal.currency || !this.signal.amount || !this.signal.nonce) {
      this.toastr.error('Signal\'s data is empty')
      this.signalState = SignalStateEnum.Failed
      this.signal.clear()
      return
    }

    const hash = this.signalService.hash(this.signal)

    this.traderService.addSignal(this.signal, hash).subscribe(
      (result) => {
        this.signalState = SignalStateEnum.Successed

        this.balance = result.newBalance

        this.signalAdded.emit(result.newSignal)
        this.signal.clear()
      },
      (error: any) => {
        this.toastr.error('Max unproved signals - ' + SharedConsts.tradeSize, 'Signal adding failed')
        console.log(error)
        this.signalState = SignalStateEnum.Failed
        this.signal.clear()
      }
    )
  }

}
