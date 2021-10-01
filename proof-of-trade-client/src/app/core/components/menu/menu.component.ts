import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  public connectionModel = new ConnectionModel(ProviderStatusEnum.DISCONNECTED)

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {}

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
