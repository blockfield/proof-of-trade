import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
  }

  public sendEmail(): void {
    if (!this.account.email) {
      console.log('empty signal data')
      return
    }

    this.isAdding = true

    this.traderService.addTrader(this.account.email).subscribe(
      () => {
        this.traderAdded.emit(this.account.email)
        this.isAdding = false
      },
      (error: any) => {
        console.log('error on addTrader: ', error)
        this.isAdding = false
      }
    )
  }

}
