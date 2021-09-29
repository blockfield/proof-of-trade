import { Component, Input, OnInit } from '@angular/core';
import { verificationText } from 'src/app/core/enums/verification.enum';
import { ZkService } from 'src/app/modules/shared/services/zk.service';
import { TraderModel } from '../../models/trader.model';

@Component({
  selector: 'app-verifier-card',
  templateUrl: './verifier-card.component.html',
  styleUrls: ['./verifier-card.component.less']
})
export class VerifierCardComponent implements OnInit {
  @Input('trader') trader: TraderModel

  public verificationStatesText = verificationText

  constructor(
    private zkService: ZkService
  ) { }

  ngOnInit(): void {
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
