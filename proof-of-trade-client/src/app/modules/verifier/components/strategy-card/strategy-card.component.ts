import { Component, Input, OnInit } from '@angular/core';
import { VerificationTraderEnum, verificationTraderText } from 'src/app/core/enums/verification-trader.enum';
import { ZkService } from 'src/app/modules/shared/services/zk.service';
import { StrategyModel } from '../../models/strategy.model';

@Component({
  selector: 'app-strategy-card',
  templateUrl: './strategy-card.component.html',
  styleUrls: ['./strategy-card.component.less']
})
export class StrategyCardComponent implements OnInit {
  @Input('strategy') strategy: StrategyModel

  public verificationStatesText = verificationTraderText

  constructor(
    private zkService: ZkService
  ) { }

  ngOnInit(): void {
  }

  public verifyTrader(): void {
    this.strategy.setState(VerificationTraderEnum.Processing)

    this.zkService.verifyAll(this.strategy.address, this.strategy.proofIds).subscribe(
      (isSuccess: boolean) => {
        this.strategy.setState(isSuccess ? VerificationTraderEnum.Success : VerificationTraderEnum.Failed)
      },
      (error: any) => {
        this.strategy.setState(VerificationTraderEnum.Failed)
        console.log('verify period error: ', error)
      }
    )
  }

}
