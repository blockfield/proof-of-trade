import { Component, OnInit } from '@angular/core';
import { ProofItem } from '../../models/proof-item';
import { TraderService } from '../../services/trader.service';

@Component({
  selector: 'app-proof',
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.less']
})
export class ProofComponent implements OnInit {
  public proof: ProofItem[]

  constructor(
    private traderService: TraderService,
  ) { }

  ngOnInit(): void {
    this.initProof()
  }

  private initProof(): void {
    this.traderService.getProofList().subscribe(
      (proof: ProofItem[]) => {
        this.proof = proof
      }
    )
  }

  public onProofAdded(): void {
    this.initProof()
  }

}
