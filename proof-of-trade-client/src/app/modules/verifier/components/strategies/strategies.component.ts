import { Component, OnInit } from '@angular/core';
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
    private tradersService: TradersService,
  ) { }

  ngOnInit(): void {
    this.initStrategies()
  }

  private initStrategies(): void {
    this.tradersService.getTraders().subscribe(
      (strategy: StrategyModel) => {
        if (this.strategies === undefined) {
          this.strategies = []
        }
        
        this.strategies.push(strategy)
      }
    )
  }

}
