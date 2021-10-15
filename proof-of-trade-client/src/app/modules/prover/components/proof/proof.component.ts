import { Component, OnInit } from '@angular/core';
import SharedConsts from 'src/app/core/consts/shared-consts';
import { ProofItem } from '../../models/proof-item';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-proof',
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.less']
})
export class ProofComponent implements OnInit {
  public proof: ProofItem[]
  public isLoading = true
  public tradeSize = SharedConsts.tradeSize

  constructor(
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
    this.initProof(true)
  }

  private initProof(isOnInit: boolean = false): void {
    this.traderService.getProofList().subscribe(
      (proof: ProofItem[]) => {
        this.proof = proof
        
        if (isOnInit) {
          this.flipLoading()
        }
      }
    )
  }

  private flipLoading(): void {
    this.isLoading = !this.isLoading
  }

  public onProofAdded(): void {
    this.initProof()
  }

}
