import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../../models/account.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less']
})
export class AddAccountComponent implements OnInit {

  public account: AccountModel = new AccountModel()

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
  }

  public sendEmail(): void {
    if (!this.account.email) {
      console.log('empty signal data')
      return
    }

    this.accountService.addTrader(this.account.email).subscribe(
      () => {
        console.log('trader is added')
      },
      (error: any) => {
        console.log('error on addTrader: ', error)
      }
    )
  }

}
