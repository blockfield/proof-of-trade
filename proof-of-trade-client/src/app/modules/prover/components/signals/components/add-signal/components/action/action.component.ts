import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { actions, actionsText, SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import { SignalModel } from 'src/app/modules/prover/models/signal.model';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.less']
})
export class ActionComponent implements OnInit {
  @Input() public signal: SignalModel
  @Output() ready = new EventEmitter();
  @Output() back = new EventEmitter();

  public actions: SignalActionEnum[] = actions
  public actionsText = actionsText

  constructor() { }

  ngOnInit(): void {
  }

  public setAction(action: SignalActionEnum): void {
    this.signal.action = action
    this.ready.emit()
  }

}
