import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { verificationProofText } from 'src/app/core/enums/verification-proof.enum';
import { ZkService } from 'src/app/modules/shared/services/zk.service';
import { TraderModel } from '../../models/trader.model';
import { TradersService } from '../../services/traders.service';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.less']
})
export class TraderComponent implements OnInit {
  verificationStatesText = verificationProofText
  faCopy = faCopy

  public trader: TraderModel

  constructor(
    private route: ActivatedRoute,
    private tradersService: TradersService,
    private zkService: ZkService,
  ) { }

  ngOnInit(): void {
    this.initTrader()
  }

  private initTrader(): void {
    this.route.params.subscribe((params: Params) => {
      const traderId: number = params.id

      this.tradersService.getTrader(traderId).subscribe(
        (trader: TraderModel) => {
          this.trader = trader
        }
      )
    })
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
        console.log('verify period error: ', error)
      }
    )
  }

}
