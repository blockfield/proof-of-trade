import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import SharedConsts from 'src/app/core/consts/shared-consts';
import { ToastService } from 'src/app/modules/shared/services/toast.service';

import { TraderService } from '../../../../services/trader.service';

@Component({
  selector: 'app-generate-proof',
  templateUrl: './generate-proof.component.html',
  styleUrls: ['./generate-proof.component.less']
})
export class GenerateProofComponent implements OnInit {
  @Output() proofAdded = new EventEmitter<void>()

  public tradeSize = SharedConsts.tradeSize

  public unprovedSignalsCount: number|undefined
  public isGenerating = false
  public canGenerate = false

  constructor(
    private toastr: ToastService,
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
    this.initUnprovedSignals()
  }

  private initUnprovedSignals(): void {
    this.traderService.getMySignals().subscribe(
      (signals) => {
        this.unprovedSignalsCount = signals.filter(x => !x.isProved).length

        this.canGenerate = this.unprovedSignalsCount === SharedConsts.tradeSize
      },
      (error: any) => {
        this.toastr.error('Can not get unproved signals count')
        console.log(error)
      }
    )
  }

  public generateProof(): void {
    this.flipGenerating()

    this.traderService.addPeriodProof().subscribe(
      () => {
        this.proofAdded.emit()
        this.initUnprovedSignals()
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
