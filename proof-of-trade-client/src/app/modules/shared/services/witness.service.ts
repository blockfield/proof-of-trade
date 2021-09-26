import { Injectable } from '@angular/core';
import { WitnessProveResult } from '../models/witness-prove-result';
import { WitnessVerifyProof } from '../models/witness-verify-proof';
import { WitnessVerify } from '../models/witness-verify';
import { WitnessProve } from '../models/witness-prove';

@Injectable({
  providedIn: 'root'
})
export class WitnessService {

  constructor() { }

  public async prove(witnessProve: WitnessProve): Promise<WitnessProveResult> {
    return (window as any).witness({
      "type": [witnessProve.actions[0], witnessProve.actions[1]],
      "value": [witnessProve.amounts[0], witnessProve.amounts[1]],
      "salt": [witnessProve.nonces[0], witnessProve.nonces[1]],
      "previousBalance": [Math.round(witnessProve.balances[0]), Math.round(witnessProve.balances[1])],
      "previousBalanceHash": witnessProve.previousBalanceHash,
      "hash": [witnessProve.hashes[0], witnessProve.hashes[1]],
      "price": [Math.round(witnessProve.prices[0]), Math.round(witnessProve.prices[1]), Math.round(witnessProve.prices[2])]
  })
  }

  public async verify(verificationKey: any, verifyModel: WitnessVerify, verifyProofModel: WitnessVerifyProof): Promise<boolean> {
    return (window as any).groth16Verify(
      verificationKey,
      verifyModel.toArray(),
      verifyProofModel
    )
  }
}
