import { Component, Inject, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { SmartContractInterface } from '../shared/interfaces/smart-contract.interface';
import { WalletService } from '../shared/services/wallet.service';

@Component({
  selector: 'app-prover',
  templateUrl: './prover.component.html',
  styleUrls: ['./prover.component.less']
})
export class ProverComponent implements OnInit {

  public email: string|undefined

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initEmail()
  }

  private initEmail(): void {
    from(this.contract.getEmail(this.walletService.getAddress())).subscribe(
      (email: string) => {
        this.email = email
      }
    )
  }

  public onTraderAdded(email: string): void {
    this.email = email
  }

}
