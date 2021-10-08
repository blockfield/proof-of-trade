import { Component, OnInit } from '@angular/core';
import { map, mergeMap, tap } from 'rxjs/operators';
import { currencies, currenciesText, CurrencyEnum } from 'src/app/core/enums/currency.enum';
import { actions, actionsText, SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import { ProofItem } from '../../../../models/proof-item';
import { ProofModel } from '../../../../models/proof.model';
import { SignalModel } from '../../../../models/signal.model';
import { TraderService } from '../../../../services/trader.service';

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

  public model: ProofModel = new ProofModel(null, null, [])

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
      console.log('empty init balance for usd and eth')
      return
    }

    this.traderService.getSignals().pipe(
      map(
        (signals: SignalModel[]) => signals.map(
          (x, index) => new ProofItem(index, x.currency, x.action, x.amount,x.nonce)
        )
      ),
      tap((proof: ProofItem[]) => { this.model.proofs = proof }),
      mergeMap(() => this.traderService.addPeriodProof(this.model))
    ).subscribe(
      () => {
        console.log('period added')
      },
      (error: any) => {
        console.log('proof is invalid', error)
      }
    )
  }

}
