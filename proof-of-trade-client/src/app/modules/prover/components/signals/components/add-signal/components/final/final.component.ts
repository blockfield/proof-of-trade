import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignalStateEnum } from 'src/app/core/enums/signal-state.enum';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.less']
})
export class FinalComponent implements OnInit {
  @Input() signalState: SignalStateEnum
  @Output() ready = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  public retry(): void {
    this.ready.emit()
  }

}
