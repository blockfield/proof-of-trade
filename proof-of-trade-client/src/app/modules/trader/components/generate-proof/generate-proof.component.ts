import { Component, OnInit } from '@angular/core';
import { ProofModel } from 'src/app/modules/trader/models/proof.model';
import { currencies, currenciesText, CurrencyEnum } from '../../../trader/enums/currency.enum';
import { actions, actionsText, SignalActionEnum } from '../../enums/signal-actione.enum';
import { ProofDataModel } from '../../models/proof-data.model';
import { ProofService } from '../../services/proof.service';

@Component({
  selector: 'app-generate-proof',
  templateUrl: './generate-proof.component.html',
  styleUrls: ['./generate-proof.component.less']
})
export class GenerateProofComponent implements OnInit {
  public currencies: CurrencyEnum[] = currencies
  public currenciesText = currenciesText
  public actions: SignalActionEnum[] = actions
  public actionsText = actionsText

  public model: ProofModel = new ProofModel(
    null, null, [
    new ProofDataModel(0, this.currencies[0], SignalActionEnum.Buy),
    new ProofDataModel(1, this.currencies[0], SignalActionEnum.Buy),
  ])

  constructor(
    private proofService: ProofService,
  ) { }

  ngOnInit(): void {
  }

  public selectCurrency(proofId: number, selectedCurrency: CurrencyEnum): void {
    let proof = this.model.proof[proofId]
    if (!proof) {
      return
    }

    proof.currency = selectedCurrency
  }

  public selectAction(proofId: number, action: SignalActionEnum): void {
    let proof = this.model. proof[proofId]
    if (!proof) {
      return
    }

    proof.action = action
  }

  public generateProof(): void {
    if (this.model.usdBalance === null || this.model.ethBalance === null) {
      console.log('empty init balance for uds and eth')
      return
    }

    this.model.proof.forEach(function (data: ProofDataModel) {
      if (!data || !data.amount || !data.currency || !data.nonce) {
        console.log('none filled row:')
      }
      
      console.log(data.id + data.currency + data.amount + data.nonce + data.action)
    });

    this.proofService.addPeriodProof(this.model).subscribe(
      () => {
        console.log('period added')
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
