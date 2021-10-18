import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignalModel } from 'src/app/modules/prover/models/signal.model';

@Component({
  selector: 'app-nonce',
  templateUrl: './nonce.component.html',
  styleUrls: ['./nonce.component.less']
})
export class NonceComponent implements OnInit {
  @Input() public signal: SignalModel
  @Output() ready = new EventEmitter();
  @Output() back = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public enterNonce(): void {
    this.ready.emit()
  }

  public backClick(): void {
    this.back.emit()
  }

}
