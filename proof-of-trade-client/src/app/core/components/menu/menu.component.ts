import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/modules/shared/services/wallet.service';
import { ProviderStatusEnum } from '../../enums/provider-status.enum';
import { ConnectedEvent } from '../../events/connected.event';
import { ConnectionModel } from '../../models/connection.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
  @Output() connectedEvent = new EventEmitter<ConnectedEvent>();

  public states = ["user", "trader"]
  public current: string

  public connectionModel = new ConnectionModel(ProviderStatusEnum.DISCONNECTED)

  constructor(
    private location: Location,
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initCurrent(this.location.path())
  }

  private initCurrent(path: string): void {
    let state = this.states[0]
    if (path) {
      state = path.match(/\/(.*)/)[1]

      if (!this.states.includes(state)) {
        state = this.states[0]
      }
    }

    this.current = state
  }

  public goTo(stateToGo: string): void {
    if (stateToGo === this.current) {
      return
    }

    this.current = stateToGo
    this.router.navigateByUrl('/'+stateToGo)
  }

  public connectToProvider(): void {
    this.connectionModel.setConnectionStatus(ProviderStatusEnum.CONNECTING)

    this.walletService.connect().subscribe(
      (account: string) => {
        this.connectedEvent.emit(new ConnectedEvent(account, null))
        this.connectionModel.setConnectionStatus(ProviderStatusEnum.CONNECTED)
      },
      (error: Error) => {
        this.connectedEvent.emit(new ConnectedEvent(null, error))
        this.connectionModel.setConnectionStatus(ProviderStatusEnum.DISCONNECTED)
      }
    )

    return
  }

}
