import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

import { StrategyModel } from '../../models/strategy.model';
import { TradersService } from '../../services/traders.service';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.less']
})
export class StrategiesComponent implements OnInit {
  strategies: StrategyModel[]

  constructor(
    private spinner: NgxSpinnerService,
    private tradersService: TradersService,
  ) { }

  ngOnInit(): void {
    this.initStrategies()
    this.initSpinner()
  }

  private initStrategies(): void {
    this.tradersService.getTraders().subscribe(
      (strategy: StrategyModel) => {
        if (this.strategies === undefined) {
          this.strategies = []
        }
        
        this.strategies.push(strategy)
        
        this.spinner.hide()
      }
    )
  }

  private initSpinner(): void {
    this.spinner.show()
  }

}
