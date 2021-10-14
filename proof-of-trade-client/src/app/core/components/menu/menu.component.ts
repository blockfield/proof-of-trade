import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/modules/shared/services/wallet.service';
import { menuButtons, menuText } from '../../enums/menu.enum';
import { ProviderStatusEnum } from '../../enums/provider-status.enum';
import { ConnectedEvent } from '../../events/connected.event';
import { ConnectionModel } from '../../models/connection.model';
import { StateModel } from '../../models/state.model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
  @Output() connectedEvent = new EventEmitter<ConnectedEvent>();

  public menu = menuButtons
  public menuText = menuText

  public connectionModel = new ConnectionModel(ProviderStatusEnum.DISCONNECTED)
  public stateModel = new StateModel()

  constructor(
    private menuService: MenuService,
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initMenuState()
  }

  private initMenuState(): void {
    this.menuService.stateChanged$.subscribe(
      (stateModel: StateModel) => {
        this.stateModel = stateModel
      }
    )
  }

  public goToHome(): void {
    this.menuService.changeState(null)

    this.router.navigate(['/'])
  }

  public goToSubState(state: string, subState: string): void {
    this.stateModel.setSubState(subState)

    this.router.navigate([state, subState])
  }

  public connectToProvider(): void {
    this.connectionModel.setConnectionStatus(ProviderStatusEnum.CONNECTING)

    this.walletService.connect().subscribe(
      (account: string) => {
        console.log('connect to provider', account)
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
