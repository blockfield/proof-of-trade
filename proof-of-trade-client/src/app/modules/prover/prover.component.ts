import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

import { MenuService } from 'src/app/core/services/menu.service';
import { SmartContractInterface } from '../shared/interfaces/smart-contract.interface';
import { WalletService } from '../shared/services/wallet.service';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-prover',
  templateUrl: './prover.component.html',
  styleUrls: ['./prover.component.less']
})
export class ProverComponent implements OnInit {
  public address: string|undefined = undefined
  public email: string|undefined = undefined

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private location: Location,
    private menuService: MenuService,
    private spinner: NgxSpinnerService,
    private toastr: ToastService,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initConnection()
    this.initSpinner()
    this.initMenu()
  }

  private initConnection(): void {
    this.walletService.address$.pipe(
      filter((address: string|null) => !!address),
      tap((address: string) => { this.address = address }),
      mergeMap((address: string) => from(this.contract.getEmail(address)))
    ).subscribe((email: string) => {
      this.email = email

      this.spinner.hide()

      if (email) {
        this.initMenu()
      }

      this.toastr.success(this.address.slice(0, 4) + '.....' + this.address.slice(-4), 'Connected to wallet:')
    })
  }

  private initMenu(): void {
    let states = this.location.normalize(this.location.path()).split('/')

    this.menuService.changeState(states[1], states[2])
  }

  private initSpinner(): void {
    this.spinner.show()
  }

  public onTraderAdded(email: string): void {
    this.email = email
    this.initMenu()
  }

}
