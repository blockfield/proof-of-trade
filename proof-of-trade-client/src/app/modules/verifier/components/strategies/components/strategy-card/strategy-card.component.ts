import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { VerificationProverEnum, verificationProverText } from 'src/app/core/enums/verification-trader.enum';
import { ZkService } from 'src/app/modules/shared/services/zk.service';
import { StrategyModel } from '../../../../models/strategy.model';

@Component({
  selector: 'app-strategy-card',
  templateUrl: './strategy-card.component.html',
  styleUrls: ['./strategy-card.component.less']
})
export class StrategyCardComponent implements OnInit {
  @Input('strategy') strategy: StrategyModel

  public verificationStatesText = verificationProverText

  constructor(
    private toastr: ToastrService,
    private zkService: ZkService
  ) { }

  ngOnInit(): void {
  }

  public verifyTrader(): void {
    this.strategy.setState(VerificationProverEnum.Processing)

    this.zkService.verifyAll(this.strategy.address, this.strategy.proofIds).subscribe(
      (isSuccess: boolean) => {
        this.strategy.setState(isSuccess ? VerificationProverEnum.Success : VerificationProverEnum.Failed)
      },
      (error: any) => {
        this.strategy.setState(VerificationProverEnum.Failed)
        this.toastr.error('Something went wrong')
        console.log(error)
      }
    )
  }

}
