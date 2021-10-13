import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private toastr: ToastrService,
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
  }

  public generateProof(): void {
    if (this.model.usdBalance === null || this.model.btcBalance === null) {
      this.toastr.error('Empty balances')
      return
    }

    this.traderService.getLastSignalsForProof().pipe(
      map(
        (signals: SignalModel[]) => signals.map(
          (x, index) => new ProofItem(index, x.currency, x.action, x.amount, x.nonce, x.price)
        )
      ),
      tap((proof: ProofItem[]) => { this.model.proofs = proof }),
      mergeMap(() => this.traderService.addPeriodProof(this.model))
    ).subscribe(
      () => {
        this.proofAdded.emit()
      },
      (error: any) => {
        this.toastr.error('Can not add wrong proof')
        console.log(error)
      }
    )
  }

}
