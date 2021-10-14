import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { BalanceModel } from 'src/app/modules/prover/models/balance.model';
import { ToastService } from 'src/app/modules/shared/services/toast.service';

import { ProofItem, ProofModel } from '../../../../models/proof.model';
import { SignalModel } from '../../../../models/signal.model';
import { TraderService } from '../../../../services/trader.service';

@Component({
  selector: 'app-generate-proof',
  templateUrl: './generate-proof.component.html',
  styleUrls: ['./generate-proof.component.less']
})
export class GenerateProofComponent implements OnInit {
  @Output() proofAdded = new EventEmitter<void>()

  public model: ProofModel = new ProofModel(null, null, [])
  public isGenerating = false

  constructor(
    private toastr: ToastService,
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
  }

  public generateProof(): void {
    this.flipGenerating()

    forkJoin({
      signals: this.traderService.getLastSignalsForProof(),
      balances: this.traderService.getMyStorageBalance()
    }).pipe(
      mergeMap((result) => {
        if (result.signals.length < 2) {
          throw new Error('No signals')
        }

        this.model.proofs = result.signals.map(
          (x, index) => new ProofItem(index, x.currency, x.action, x.amount, x.nonce, x.price)
        )

        this.model.usdBalance = result.balances.slice(-3)[0].usd
        this.model.btcBalance = result.balances.slice(-3)[0].btc
        
        return this.traderService.addPeriodProof(this.model)
      })
    ).subscribe(
      () => {
        this.proofAdded.emit()
        this.flipGenerating()
      },
      (error: any) => {
        this.toastr.error('Can not add wrong proof')
        console.log(error)
        this.flipGenerating()
      }
    )
  }

  private flipGenerating(): void {
    this.isGenerating = !this.isGenerating
  }

}
