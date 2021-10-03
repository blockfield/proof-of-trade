import { Component, Input, OnInit } from '@angular/core';
import { verificationProofText } from 'src/app/core/enums/verification-proof.enum';
import { VerificationTraderEnum, verificationTraderText } from 'src/app/core/enums/verification-trader.enum';
import { ZkService } from 'src/app/modules/shared/services/zk.service';
import { TraderModel } from '../../models/trader.model';

@Component({
  selector: 'app-verifier-card',
  templateUrl: './verifier-card.component.html',
  styleUrls: ['./verifier-card.component.less']
})
export class VerifierCardComponent implements OnInit {
  @Input('trader') trader: TraderModel

  public verificationStatesText = verificationTraderText

  constructor(
    private zkService: ZkService
  ) { }

  ngOnInit(): void {
  }

  public verifyTrader(): void {
    let proofIds = this.trader.proof.map(x => x.id)

    this.trader.setState(VerificationTraderEnum.Processing)

    this.zkService.verifyAll(this.trader.address, proofIds).subscribe(
      (isSuccess: boolean) => {
        this.trader.setState(isSuccess ? VerificationTraderEnum.Success : VerificationTraderEnum.Failed)
      },
      (error: any) => {
        this.trader.setState(VerificationTraderEnum.Failed)
        console.log('verify period error: ', error)
      }
    )
  }

}
