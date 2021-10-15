import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import MathHelper from 'src/app/core/helpers/math.helper';
import { SignalModel } from 'src/app/modules/prover/models/signal.model';

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.less']
})
export class AmountComponent implements OnInit {
  @Input() public signal: SignalModel
  @Output() ready = new EventEmitter();

  public amount: string

  constructor() { }

  ngOnInit(): void {
  }

  public enterAmount(): void {
    this.signal.amount = MathHelper.decimalDigitsNumber(+this.amount)
    this.ready.emit()
  }

}
