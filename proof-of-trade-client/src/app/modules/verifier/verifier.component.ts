import { Component, OnInit } from '@angular/core';
import { TraderModel } from './models/trader.model';
import { TradersService } from './services/traders.service';

@Component({
  selector: 'app-verifier',
  templateUrl: './verifier.component.html',
  styleUrls: ['./verifier.component.less']
})
export class VerifierComponent implements OnInit {
  traders: TraderModel[]

  constructor(
    private tradersService: TradersService,
  ) { }

  ngOnInit(): void {
    this.initTraders()
  }

  private initTraders(): void {
    this.tradersService.getTraders().subscribe(
      (traders: TraderModel) => {
        if (this.traders === undefined) {
          this.traders = []
        }
        
        this.traders.push(traders)
      }
    )
  }

}
