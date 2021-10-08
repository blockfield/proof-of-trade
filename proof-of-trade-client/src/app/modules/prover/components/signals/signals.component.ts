import { Component, OnInit } from '@angular/core';
import { currenciesText } from 'src/app/core/enums/currency.enum';
import { actionsText } from 'src/app/core/enums/signal-action.enum';
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

  public signals: SignalModel[]

  constructor(
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
    this.initSignals()
  }

  public initSignals(): void {
    // todo can we use here just `public signals$`. Is new signal will be added?
    this.traderService.getMySignals().subscribe(
      (signals: SignalModel[]) => {
        this.signals = signals
      },
      (error: any) => {
        console.log('signals are failed', error)
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
