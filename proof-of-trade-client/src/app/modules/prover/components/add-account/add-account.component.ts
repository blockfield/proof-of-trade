import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastService } from 'src/app/modules/shared/services/toast.service';

import { AccountModel } from '../../models/account.model';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less']
})
export class AddAccountComponent implements OnInit {
  @Output() traderAdded: EventEmitter<string> = new EventEmitter<string>();

  public account: AccountModel = new AccountModel()
  public isAdding = false

  constructor(
    private toastr: ToastService,
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
  }

  public addEmail(): void {
    if (!this.account.email) {
      this.toastr.error('Empty trader name')
      return
    }

    this.isAdding = true

    this.traderService.addTrader(this.account.email).subscribe(
      () => {
        this.traderAdded.emit(this.account.email)
        this.isAdding = false
      },
      (error: any) => {
        this.toastr.error('Something went wrong')
        console.log(error)
        this.isAdding = false
      }
    )
  }

}
