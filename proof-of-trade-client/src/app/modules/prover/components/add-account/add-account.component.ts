import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../../models/account.model';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less']
})
export class AddAccountComponent implements OnInit {

  public account: AccountModel = new AccountModel()

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

    this.traderService.addTrader(this.account.email).subscribe(
      () => {
        console.log('trader is added')
      },
      (error: any) => {
        console.log('error on addTrader: ', error)
      }
    )
  }

}
