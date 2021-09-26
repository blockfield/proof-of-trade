import { Component, OnInit } from '@angular/core';
import { verificationText } from 'src/app/core/enums/verification.enum';
import { ZkService } from '../shared/services/zk.service';
import { TraderModel } from './models/trader.model';
import { TradersService } from './services/traders.service';

@Component({
  selector: 'app-verifier',
  templateUrl: './verifier.component.html',
  styleUrls: ['./verifier.component.less']
})
export class VerifierComponent implements OnInit {
  public verificationStatesText = verificationText

  traders: TraderModel[] = [];

  constructor(
    private tradersService: TradersService,
    private zkService: ZkService,
  ) { }

  ngOnInit(): void {
    this.initTraders()
  }

  private initTraders(): void {
    this.tradersService.getTraders().subscribe(
      (traders: TraderModel) => {
        this.traders.push(traders)
      }
    )
  }

  public verifyProof(traderId: number, proofId: number): void {
    let trader = this.traders[traderId]
    if (!trader) {
      return;
    }

    let proof = trader.proof[proofId]
    if (!proof) {
      return;
    }

    this.zkService.verify(trader.address, proof.id).subscribe(
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
