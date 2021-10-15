import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { NgxSpinnerService } from "ngx-spinner";

import { verificationProofText } from 'src/app/core/enums/verification-proof.enum';
import { TradersService } from 'src/app/modules/verifier/services/traders.service';
import { ZkService } from 'src/app/modules/shared/services/zk.service';
import { TraderModel } from '../../../shared/models/trader.model';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import SharedConsts from 'src/app/core/consts/shared-consts';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.less']
})
export class TraderComponent implements OnInit {
  public verificationStatesText = verificationProofText
  public faCopy = faCopy
  public tradeSize = SharedConsts.tradeSize

  public trader: TraderModel

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private toastr: ToastService,
    private tradersService: TradersService,
    private zkService: ZkService,
  ) { }

  ngOnInit(): void {
    this.initSpinner()
    this.initTrader()
  }

  private initTrader(): void {
    this.route.params.subscribe((params: Params) => {
      const traderId: number = params.id

      this.tradersService.getTrader(traderId).subscribe(
        (trader: TraderModel) => {
          this.trader = trader
          this.spinner.hide()
        }
      )
    })
  }

  private initSpinner(): void {
    this.spinner.show()
  }

  public copied(event: any): void {
    if (event.isSuccess) {
      this.toastr.success('Address succesfully copied')
    }
  }

  public verifyProof(proofId: number): void {
    let proof = this.trader.proof[proofId]
    if (!proof) {
      return;
    }

    this.zkService.verify(this.trader.address, proof.id).subscribe(
      (isSuccess: boolean) => {
        proof.setState(isSuccess)
      },
      (error: any) => {
        proof.setState(false)
        this.toastr.error('Something went wrong')
        console.log('verify period error: ', error)
      }
    )
  }

}
