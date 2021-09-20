import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Contract } from 'src/app/api/ethereum/contract';
import { EthereumContract } from 'src/app/api/ethereum/ethereum-contract';
import { OracleContract } from 'src/app/api/ethereum/oracle-contract';
import { ContractInterface } from 'src/app/api/interfaces/contract.interface';
import { EthereumContractInterface } from 'src/app/api/interfaces/ethereum-contract.interface';
import { OracleContractInterface } from 'src/app/api/interfaces/oracle-contract.interface';
import { ProofModel } from '../models/proof.model';
import { WitnessModel } from '../models/witness.model';
import { WitnessService } from './witness.service';

@Injectable({
  providedIn: 'root'
})
export class ProofService {

  private contract: ContractInterface = new Contract()
  private oracleContract: OracleContractInterface = new OracleContract()
  private ethereumContract: EthereumContractInterface = new EthereumContract()

  constructor(
    private witnessService: WitnessService,
  ) { }

  public addPeriodProof(model: ProofModel): Observable<void> {
    try {
      this.processProofModel(model)
    } catch(error: any) {
      return throwError(error)
    }

    return of()
  }

  private processProofModel(model: ProofModel): void {
    // let accounts = ['']

    // const len = this.contract.getTradeLen()
    // const a = this.contract.getSignal(accounts[0], len - 2)
    // const b = this.contract.getSignal(accounts[0], len - 1)

    // const currentBlock = this.ethereumContract.getBlockNumber()
    const currentBlock = 1

    // const price_a = this.oracleContract.currentAnswer(a.blockNumber)
    // const price_b = this.oracleContract.currentAnswer(b.blockNumber)
    // const price_now = this.oracleContract.currentAnswer(currentBlock)

    // const proofLen = this.contract.getProofLen(accounts[0]);
    // let previousBalanceHash;
    // if (proofLen === 0) {
    //     previousBalanceHash = '12991363837217894993991711342410433599666196004667524206273513024950584067662';
    // } else {
    //     previousBalanceHash = this.contract.getPrevBalanceHash(accounts[0], proofLen - 1)
    // }

    let input = new WitnessModel(
      // [model.proof[0].action, model.proof[1].action],
      // [model.proof[0].amount, model.proof[1].amount],
      // [model.proof[0].nonce, model.proof[1].nonce],
      // [model.usdBalance, model.ethBalance],
      // previousBalanceHash,
      // [a.hash, b.hash],
      // [Math.round(price_a), Math.round(price_b), Math.round(price_now)]
      [],[],[],[],'',[],[]
    )

    let proof = this.witnessService.prove(input, currentBlock)

    console.log(proof)

    this.contract.addPeriodProof(proof)
  }
}
