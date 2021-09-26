import { Component, OnInit } from '@angular/core';
import { currencies, currenciesText, CurrencyEnum } from 'src/app/core/enums/currency.enum';
import { actions, actionsText, SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import { ProofItem } from '../../models/proof-item';
import { ProofModel } from '../../models/proof.model';
import { TraderService } from '../../services/trader.service';

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
    new ProofItem(0, this.currencies[0], SignalActionEnum.Buy),
    new ProofItem(1, this.currencies[0], SignalActionEnum.Buy),
  ])

  constructor(
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
  }

  public selectCurrency(proofId: number, selectedCurrency: CurrencyEnum): void {
    let proof = this.model.proofs[proofId]
    if (!proof) {
      return
    }

    proof.currency = selectedCurrency
  }

  public selectAction(proofId: number, action: SignalActionEnum): void {
    let proof = this.model. proofs[proofId]
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

    let isModellValid = true
    this.model.proofs.forEach(function (data: ProofItem) {
      if (!data || !data.amount || !data.currency || !data.nonce) {
        console.log('none filled row:')
        isModellValid = false
      }
    });

    if (!isModellValid) {
      return
    }

    this.traderService.addPeriodProof(this.model).subscribe(
      () => {
        console.log('period added')
      },
      (error: any) => {
        console.log('proof is invalid', error)
      }
    )
  }

}
