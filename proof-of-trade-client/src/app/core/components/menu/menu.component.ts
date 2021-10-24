import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { PriceService } from 'src/app/modules/shared/services/price.service';
import { WalletService } from 'src/app/modules/shared/services/wallet.service';
import { menuButtons, menuText } from '../../enums/menu.enum';
import { ProviderStatusEnum } from '../../enums/provider-status.enum';
import MathHelper from '../../helpers/math.helper';
import { ConnectionModel } from '../../models/connection.model';
import { StateModel } from '../../models/state.model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
  public menu = menuButtons
  public menuText = menuText
  public faArrowAltCircleUp = faArrowAltCircleUp
  public faArrowAltCircleDown = faArrowAltCircleDown

  public connectionModel = new ConnectionModel(ProviderStatusEnum.DISCONNECTED)
  public stateModel = new StateModel()
  public btcPrice: number
  public lastBtcPrice: number

  constructor(
    private menuService: MenuService,
    private priceService: PriceService,
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initMenuState()
    this.initPrice()
  }

  private initMenuState(): void {
    this.menuService.stateChanged$.subscribe(
      (stateModel: StateModel) => {
        this.stateModel = stateModel
      }
    )
  }

  private initPrice(): void {
    this.priceService.getBtcPrice().subscribe((price: number) => {
      this.lastBtcPrice = this.btcPrice
      this.btcPrice = MathHelper.removeDecimalDigitsNumber(price)
    })
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
        this.connectionModel.setConnectionStatus(ProviderStatusEnum.CONNECTED)
      },
      (error: Error) => {
        this.connectionModel.setConnectionStatus(ProviderStatusEnum.DISCONNECTED)
      }
    )

    return
  }

}
