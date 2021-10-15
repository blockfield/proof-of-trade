import { Component, OnInit } from '@angular/core';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import SharedConsts from 'src/app/core/consts/shared-consts';

import { currenciesText } from 'src/app/core/enums/currency.enum';
import { actionsText } from 'src/app/core/enums/signal-action.enum';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { SignalModel } from '../../models/signal.model';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.less']
})
export class SignalsComponent implements OnInit {
  public actionsText = actionsText
  public currenciesText = currenciesText
  public faCheckCircle = faCheckCircle
  public faTimesCircle = faTimesCircle
  public maxDecimals = 10 ** SharedConsts.maxDecimalDigits

  public signals: SignalModel[]

  constructor(
    private toastr: ToastService,
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
    this.initSignals()
  }

  public initSignals(): void {
    this.traderService.getMySignals().subscribe(
      (signals: SignalModel[]) => {
        this.signals = signals
      },
      (error: any) => {
        this.toastr.error('Something went wrong')
        console.log(error)
      }
    )
  }

  public onSignalAdded(signal: SignalModel): void {
    if (!this.signals) {
      this.signals = []
    }
    
    this.signals.push(signal)
  }

}
