import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

import { MenuService } from 'src/app/core/services/menu.service';
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
    private location: Location,
    private menuService: MenuService,
    private spinner: NgxSpinnerService,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initEmail()
    this.initSpinner()
  }

  private initMenu(): void {
    let states = this.location.normalize(this.location.path()).split('/')

    this.menuService.changeState(states[1], states[2])
  }

  private initEmail(): void {
    from(this.contract.getEmail(this.walletService.getAddress())).subscribe(
      (email: string) => {
        this.email = email

        this.spinner.hide()

        if (email) {
          this.initMenu()
        }
      }
    )
  }

  private initSpinner(): void {
    this.spinner.show()
  }

  public onTraderAdded(email: string): void {
    this.email = email
    this.initMenu()
  }

}
