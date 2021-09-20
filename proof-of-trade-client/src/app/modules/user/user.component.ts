import { Component, OnInit } from '@angular/core';
import { verificationStatesText } from './enums/verification-state.enum';
import { ProofModel } from './models/proof.model';
import { TraderModel } from './models/trader.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  public verificationStatesText = verificationStatesText

  traders: TraderModel[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initTraders()
  }

  private initTraders(): void {
    let initBalance = 1000

    this.traders = [
      new TraderModel(
        0, "a@a.ru", "0x1a361c68C1D37DCbe5aca24547679E16c7BFDB75",
        [new ProofModel(0, 1100, initBalance), new ProofModel(1, 1100, 1100)]
      ),
      new TraderModel(
        1, "bbbbbb@bbbbbbb.ru", "0xb34d06369Bf3B35C05D374f505a7A7fF3f51e693",
        [new ProofModel(0, 1200, initBalance), new ProofModel(1, 1300, 1200), new ProofModel(2, 1000, 1300)]
      ),
      new TraderModel(
        2, "cccc@ccccc.ru", "0x5e23C2b71D1C9742e1aFb842eE54b6F5Fb01CA84",
        [new ProofModel(0, 1300, initBalance), new ProofModel(1, 1100, 1300)]
      ),
      new TraderModel(
        3, "dd@dd.ru", "0xCA9C49172f52539E897accc2c49adAcFC7Cb4F4B",
        [new ProofModel(0, 1000, initBalance), new ProofModel(1, 1300, 1000), new ProofModel(2, 900, 1300)]
      ),
      new TraderModel(
        4, "eeeeeeeeeeeeee@eeeeeeeeeeeeee.ru", "0x37666f514DcD16E38C44828E4000df12af8A39f4",
        [new ProofModel(0, 900, initBalance), new ProofModel(1, 1100, 900)]
      ),
      new TraderModel(
        5, "fff@fff.ru", "0xD92a2a04D716b68e4BF33cF88cf0C1526975b5bA",
        [new ProofModel(0, 800, initBalance), new ProofModel(1, 1300, 800), new ProofModel(2, 1500, 1300)]
      ),
      new TraderModel(
        6, "g@g.ru", "0xD92a2a04D716b68e4BF33cF88cf0C1526975b5bA",
        []
      )
    ]
  }

  public verifyProof(traderId: number, proofId: number): void {
    let trader = this.traders[traderId]
    if (!trader) {
      return;
    }

    let proof = trader.proof[proofId]
    if (!proof) {
      return;
    }

    proof.verify()
  }

}
