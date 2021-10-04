import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { StrategyModel } from './models/strategy.model';
import { TradersService } from './services/traders.service';

@Component({
  selector: 'app-verifier',
  templateUrl: './verifier.component.html',
  styleUrls: ['./verifier.component.less']
})
export class VerifierComponent implements OnInit {

  constructor(
    private location: Location,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    this.initMenu()
  }

  private initMenu(): void {
    let states = this.location.normalize(this.location.path()).split('/')
    
    this.menuService.changeState(states[1], states[2])
  }

}
